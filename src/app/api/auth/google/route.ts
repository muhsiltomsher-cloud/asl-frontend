import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { API_BASE, backendPostHeaders, noCacheUrl, safeJsonResponse } from "@/lib/utils/backendFetch";
import { checkRateLimit, rateLimitResponse, API_RATE_LIMIT } from "@/lib/security";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

function getWcCredentials(): { key: string; secret: string } | null {
  const key = process.env.WC_CONSUMER_KEY || process.env.NEXT_PUBLIC_WC_CONSUMER_KEY;
  const secret = process.env.WC_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET;
  if (key && secret) return { key, secret };
  return null;
}

interface GoogleTokenInfo {
  aud?: string;
  sub?: string;
  email?: string;
  email_verified?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  error_description?: string;
  iss?: string;
  exp?: number;
}

function decodeJwtPayload(token: string): GoogleTokenInfo | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = Buffer.from(parts[1], "base64url").toString("utf-8");
    return JSON.parse(payload) as GoogleTokenInfo;
  } catch {
    return null;
  }
}

async function verifyGoogleToken(credential: string, clientId: string): Promise<{ valid: boolean; info: GoogleTokenInfo | null; error?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const tokenRes = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${credential}`,
      { signal: controller.signal }
    );
    clearTimeout(timeout);

    if (!tokenRes.ok) {
      const errBody = await tokenRes.text().catch(() => "");
      console.error(`[google-auth] tokeninfo returned ${tokenRes.status}: ${errBody.slice(0, 200)}`);
      return { valid: false, info: null, error: "Token verification failed" };
    }

    const tokenInfo: GoogleTokenInfo = await tokenRes.json();
    if (tokenInfo.error_description) {
      return { valid: false, info: null, error: tokenInfo.error_description };
    }
    if (tokenInfo.aud !== clientId) {
      return { valid: false, info: null, error: "Token audience mismatch" };
    }
    return { valid: true, info: tokenInfo };
  } catch (fetchErr) {
    console.warn(`[google-auth] tokeninfo fetch failed, using JWT decode fallback:`, fetchErr instanceof Error ? fetchErr.message : fetchErr);

    const decoded = decodeJwtPayload(credential);
    if (!decoded) {
      return { valid: false, info: null, error: "Failed to decode token" };
    }

    const validIssuers = ["accounts.google.com", "https://accounts.google.com"];
    if (!decoded.iss || !validIssuers.includes(decoded.iss)) {
      return { valid: false, info: null, error: "Invalid token issuer" };
    }
    if (decoded.aud !== clientId) {
      return { valid: false, info: null, error: "Token audience mismatch" };
    }
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      return { valid: false, info: null, error: "Token expired" };
    }

    return { valid: true, info: decoded };
  }
}

interface WcCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username: string;
}

function getSocialPassword(googleUserId: string): string {
  const secret = process.env.SOCIAL_LOGIN_SECRET || process.env.WC_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || "asl-social-default";
  return crypto.createHmac("sha256", secret).update(`google:${googleUserId}`).digest("hex");
}

function wcUrl(path: string, creds: { key: string; secret: string }): string {
  const base = `${API_BASE}/wp-json/wc/v3${path}`;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}consumer_key=${creds.key}&consumer_secret=${creds.secret}`;
}

export async function POST(request: NextRequest) {
  const rateLimitResult = checkRateLimit(request, API_RATE_LIMIT);
  if (!rateLimitResult.allowed) {
    return rateLimitResponse(rateLimitResult.resetTime);
  }

  try {
    const body = await request.json();
    const credential = body.credential as string;

    if (!credential) {
      return NextResponse.json(
        { success: false, error: { code: "missing_credential", message: "Google credential is required" } },
        { status: 400 }
      );
    }

    if (!GOOGLE_CLIENT_ID) {
      return NextResponse.json(
        { success: false, error: { code: "config_error", message: "Google Sign-In is not configured" } },
        { status: 500 }
      );
    }

    const wcCreds = getWcCredentials();
    if (!wcCreds) {
      return NextResponse.json(
        { success: false, error: { code: "config_error", message: "WooCommerce API credentials are not configured" } },
        { status: 500 }
      );
    }

    const verification = await verifyGoogleToken(credential, GOOGLE_CLIENT_ID);
    if (!verification.valid || !verification.info) {
      return NextResponse.json(
        { success: false, error: { code: "invalid_token", message: verification.error || "Invalid Google token" } },
        { status: 401 }
      );
    }

    const tokenInfo = verification.info;
    const email = tokenInfo.email;
    const googleUserId = tokenInfo.sub;
    if (!email || !googleUserId) {
      return NextResponse.json(
        { success: false, error: { code: "invalid_token", message: "Google token missing required fields" } },
        { status: 401 }
      );
    }

    const socialPassword = getSocialPassword(googleUserId);

    const searchRes = await fetch(wcUrl(`/customers?email=${encodeURIComponent(email)}`, wcCreds));
    let customers: WcCustomer[] = [];

    if (searchRes.ok) {
      try {
        const parsed = await searchRes.json();
        if (Array.isArray(parsed)) customers = parsed;
      } catch {
        // ignore parse errors
      }
    } else {
      const searchErr = await safeJsonResponse(searchRes);
      console.error(`[google-auth] WC customer search failed (${searchRes.status}):`, searchErr);
    }

    if (customers.length > 0) {
      const customer = customers[0];
      const updateRes = await fetch(wcUrl(`/customers/${customer.id}`, wcCreds), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          password: socialPassword,
          meta_data: [{ key: "_google_social_login", value: "1" }],
        }),
      });
      if (!updateRes.ok) {
        console.error(`[google-auth] WC customer update failed (${updateRes.status})`);
      }
    } else {
      const displayName = tokenInfo.name || tokenInfo.given_name || email.split("@")[0];
      const createRes = await fetch(wcUrl("/customers", wcCreds), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          first_name: tokenInfo.given_name || displayName,
          last_name: tokenInfo.family_name || "",
          username: email,
          password: socialPassword,
          meta_data: [{ key: "_google_social_login", value: "1" }],
        }),
      });

      if (!createRes.ok) {
        const errData = await safeJsonResponse(createRes);
        return NextResponse.json(
          {
            success: false,
            error: {
              code: String(errData.code || "registration_failed"),
              message: String(errData.message || "Failed to create account"),
            },
          },
          { status: 400 }
        );
      }
    }

    const loginRes = await fetch(noCacheUrl(`${API_BASE}/wp-json/cocart/v2/login`), {
      method: "POST",
      headers: backendPostHeaders(),
      body: JSON.stringify({ username: email, password: socialPassword }),
    });
    const loginData = await safeJsonResponse(loginRes);

    if (!loginRes.ok) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: String(loginData.code || "login_failed"),
            message: String(loginData.message || "Authentication failed after Google sign-in"),
          },
        },
        { status: loginRes.status }
      );
    }

    let wpToken: string | undefined;
    try {
      const wpRes = await fetch(noCacheUrl(`${API_BASE}/wp-json/jwt-auth/v1/token`), {
        method: "POST",
        headers: backendPostHeaders(),
        body: JSON.stringify({ username: email, password: socialPassword }),
      });
      if (wpRes.ok) {
        const wpData = await safeJsonResponse(wpRes);
        wpToken = wpData.token as string;
      }
    } catch {
      // WP JWT token is optional
    }

    return NextResponse.json({
      success: true,
      user: {
        token: String((loginData.extras as Record<string, unknown>)?.jwt_token || loginData.jwt_token || loginData.token || ""),
        wp_token: wpToken,
        refresh_token: String((loginData.extras as Record<string, unknown>)?.jwt_refresh || loginData.jwt_refresh_token || loginData.refresh_token || ""),
        user_id: parseInt(String(loginData.user_id || "0")) || (loginData.id as number) || 0,
        user_email: String(loginData.email || loginData.user_email || email),
        user_nicename: String(loginData.user_nicename || loginData.nicename || loginData.username || email),
        user_display_name: String(loginData.display_name || loginData.user_display_name || loginData.username || tokenInfo.name || email),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "server_error",
          message: error instanceof Error ? error.message : "An unexpected error occurred",
        },
      },
      { status: 500 }
    );
  }
}
