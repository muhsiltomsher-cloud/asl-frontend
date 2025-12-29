import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

const API_BASE = siteConfig.apiUrl;

export interface ResetPasswordRequest {
  key: string;
  login: string;
  password: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

async function resetPasswordViaWooCommerce(
  key: string,
  login: string,
  password: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const resetUrl = `${API_BASE}/my-account/lost-password/`;
    const pageResponse = await fetch(resetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ASL-Frontend/1.0)",
      },
    });

    if (!pageResponse.ok) {
      return { success: false, message: "Unable to access reset page" };
    }

    const cookies = pageResponse.headers.get("set-cookie") || "";

    const formData = new URLSearchParams();
    formData.append("pass1", password);
    formData.append("pass2", password);
    formData.append("reset_key", key);
    formData.append("reset_login", login);
    formData.append("wc_reset_password", "true");
    formData.append("save", "Save");

    const resetPageUrl = `${API_BASE}/my-account/lost-password/?show-reset-form=true&key=${encodeURIComponent(key)}&login=${encodeURIComponent(login)}`;
    
    const submitResponse = await fetch(resetPageUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (compatible; ASL-Frontend/1.0)",
        "Cookie": cookies,
        "Referer": resetPageUrl,
      },
      body: formData.toString(),
      redirect: "manual",
    });

    if (submitResponse.status === 302) {
      const location = submitResponse.headers.get("location") || "";
      if (location.includes("password-reset") || location.includes("my-account")) {
        return { success: true, message: "Password has been reset successfully" };
      }
    }

    if (submitResponse.status === 200) {
      const html = await submitResponse.text();
      if (html.includes("Your password has been reset") || html.includes("password-reset=true")) {
        return { success: true, message: "Password has been reset successfully" };
      }
      if (html.includes("Invalid key") || html.includes("expired")) {
        return { success: false, message: "This password reset link has expired or is invalid" };
      }
    }

    return { success: false, message: "Unable to reset password. The link may have expired." };
  } catch (error) {
    console.error("WooCommerce reset password error:", error);
    return { success: false, message: "An error occurred while resetting password" };
  }
}

async function resetPasswordViaWordPress(
  key: string,
  login: string,
  password: string
): Promise<{ success: boolean; message?: string }> {
  try {
    const resetUrl = `${API_BASE}/wp-login.php?action=rp&key=${encodeURIComponent(key)}&login=${encodeURIComponent(login)}`;
    
    const pageResponse = await fetch(resetUrl, {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; ASL-Frontend/1.0)",
      },
      redirect: "manual",
    });

    const cookies = pageResponse.headers.get("set-cookie") || "";

    const formData = new URLSearchParams();
    formData.append("pass1", password);
    formData.append("pass2", password);
    formData.append("rp_key", key);
    formData.append("wp-submit", "Save Password");

    const submitResponse = await fetch(`${API_BASE}/wp-login.php?action=resetpass`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0 (compatible; ASL-Frontend/1.0)",
        "Cookie": cookies,
        "Referer": resetUrl,
      },
      body: formData.toString(),
      redirect: "manual",
    });

    if (submitResponse.status === 302) {
      const location = submitResponse.headers.get("location") || "";
      if (location.includes("password=changed") || location.includes("checkemail=confirm")) {
        return { success: true, message: "Password has been reset successfully" };
      }
    }

    if (submitResponse.status === 200) {
      const html = await submitResponse.text();
      if (html.includes("Your password has been reset") || html.includes("password=changed")) {
        return { success: true, message: "Password has been reset successfully" };
      }
    }

    return { success: false, message: "Unable to reset password via WordPress" };
  } catch (error) {
    console.error("WordPress reset password error:", error);
    return { success: false, message: "An error occurred while resetting password" };
  }
}

export async function POST(request: NextRequest): Promise<NextResponse<ResetPasswordResponse>> {
  try {
    const body: ResetPasswordRequest = await request.json();
    const { key, login, password } = body;

    if (!key || !key.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "missing_key",
            message: "Reset key is required",
          },
        },
        { status: 400 }
      );
    }

    if (!login || !login.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "missing_login",
            message: "Username is required",
          },
        },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "invalid_password",
            message: "Password must be at least 6 characters",
          },
        },
        { status: 400 }
      );
    }

    const wooResult = await resetPasswordViaWooCommerce(key.trim(), login.trim(), password);
    if (wooResult.success) {
      return NextResponse.json({
        success: true,
        message: wooResult.message,
      });
    }

    const wpResult = await resetPasswordViaWordPress(key.trim(), login.trim(), password);
    if (wpResult.success) {
      return NextResponse.json({
        success: true,
        message: wpResult.message,
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "reset_failed",
          message: wooResult.message || wpResult.message || "Unable to reset password. The link may have expired.",
        },
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "server_error",
          message: "An unexpected error occurred",
        },
      },
      { status: 500 }
    );
  }
}
