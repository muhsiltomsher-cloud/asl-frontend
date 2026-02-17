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
  aud?: string | string[];
  sub?: string;
  email?: string;
  email_verified?: string | boolean;
  name?: string;
  given_name?: string;
  family_name?: string;
  error_description?: string;
  iss?: string;
  exp?: number | string;
  azp?: string;
}

function decodeJwtPayload(token: string): GoogleTokenInfo | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    let b64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const payload = Buffer.from(b64, "base64").toString("utf-8");
    return JSON.parse(payload) as GoogleTokenInfo;
  } catch {
    return null;
  }
}

function audienceMatches(aud: string | string[] | undefined, clientId: string): boolean {
  if (!aud) return false;
  if (Array.isArray(aud)) return aud.includes(clientId);
  return aud === clientId;
}

function verifyGoogleToken(credential: string, clientId: string): { valid: boolean; info: GoogleTokenInfo | null; error?: string } {
  const decoded = decodeJwtPayload(credential);
  if (!decoded) {
    console.error(`[google-auth] Failed to decode JWT. Token length=${credential.length}, parts=${credential.split(".").length}`);
    return { valid: false, info: null, error: "Failed to decode Google token" };
  }

  console.warn(`[google-auth] Token decoded: iss=${decoded.iss}, aud=${JSON.stringify(decoded.aud)}, azp=${decoded.azp}, sub=${decoded.sub ? "present" : "missing"}, email=${decoded.email ? "present" : "missing"}, exp=${decoded.exp}`);

  const validIssuers = ["accounts.google.com", "https://accounts.google.com"];
  if (!decoded.iss || !validIssuers.includes(decoded.iss)) {
    console.error(`[google-auth] Invalid issuer: ${decoded.iss}`);
    return { valid: false, info: null, error: "Invalid token issuer" };
  }
  if (!audienceMatches(decoded.aud, clientId) && decoded.azp !== clientId) {
    console.error(`[google-auth] Audience mismatch: aud=${JSON.stringify(decoded.aud)}, azp=${decoded.azp}, expected=${clientId}`);
    return { valid: false, info: null, error: "Token audience mismatch" };
  }
  const expNum = typeof decoded.exp === "string" ? parseInt(decoded.exp, 10) : decoded.exp;
  if (expNum && expNum * 1000 < Date.now()) {
    console.error(`[google-auth] Token expired: exp=${expNum}, now=${Math.floor(Date.now() / 1000)}`);
    return { valid: false, info: null, error: "Token expired" };
  }
  if (!decoded.email || !decoded.sub) {
    console.error(`[google-auth] Missing fields: email=${!!decoded.email}, sub=${!!decoded.sub}`);
    return { valid: false, info: null, error: "Token missing required fields" };
  }

  const normalizedAud = Array.isArray(decoded.aud) ? decoded.aud[0] : decoded.aud;
  return { valid: true, info: { ...decoded, aud: normalizedAud } };
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

function wcApiUrl(path: string): string {
  return `${API_BASE}/wp-json/wc/v3${path}`;
}

function wcAuthHeaders(creds: { key: string; secret: string }): HeadersInit {
  const encoded = Buffer.from(`${creds.key}:${creds.secret}`).toString("base64");
  return {
    "Authorization": `Basic ${encoded}`,
    "Content-Type": "application/json",
  };
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

    const verification = verifyGoogleToken(credential, GOOGLE_CLIENT_ID);
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

    const headers = wcAuthHeaders(wcCreds);
    let passwordSet = false;

    const searchRes = await fetch(
      wcApiUrl(`/customers?email=${encodeURIComponent(email)}`),
      { headers }
    );
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
      const updateRes = await fetch(wcApiUrl(`/customers/${customer.id}`), {
        method: "PUT",
        headers,
        body: JSON.stringify({
          password: socialPassword,
          meta_data: [{ key: "_google_social_login", value: "1" }],
        }),
      });
      if (updateRes.ok) {
        passwordSet = true;
      } else {
        console.error(`[google-auth] WC customer update failed (${updateRes.status})`);
      }
    } else {
      const displayName = tokenInfo.name || tokenInfo.given_name || email.split("@")[0];
      const createRes = await fetch(wcApiUrl("/customers"), {
        method: "POST",
        headers,
        body: JSON.stringify({
          email,
          first_name: tokenInfo.given_name || displayName,
          last_name: tokenInfo.family_name || "",
          username: email,
          password: socialPassword,
          meta_data: [{ key: "_google_social_login", value: "1" }],
        }),
      });

      if (createRes.ok) {
        passwordSet = true;
      } else {
        const errData = await safeJsonResponse(createRes);
        const errCode = String(errData.code || "");
        console.error(`[google-auth] WC customer create failed (${createRes.status}):`, errData);

        if (errCode.includes("existing") || errCode === "registration-error-email-exists") {
          const retrySearch = await fetch(
            wcApiUrl(`/customers?email=${encodeURIComponent(email)}`),
            { headers }
          );
          if (retrySearch.ok) {
            try {
              const retryParsed = await retrySearch.json();
              if (Array.isArray(retryParsed) && retryParsed.length > 0) {
                const existingCustomer = retryParsed[0] as WcCustomer;
                const retryUpdate = await fetch(wcApiUrl(`/customers/${existingCustomer.id}`), {
                  method: "PUT",
                  headers,
                  body: JSON.stringify({
                    password: socialPassword,
                    meta_data: [{ key: "_google_social_login", value: "1" }],
                  }),
                });
                if (retryUpdate.ok) passwordSet = true;
              }
            } catch {
              // ignore
            }
          }
        }
      }
    }

    if (!passwordSet) {
      console.warn("[google-auth] Could not set social password via WC API, attempting login anyway");
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
