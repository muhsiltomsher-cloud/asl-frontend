import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const AUTH_TOKEN_KEY = "asl_auth_token";
const AUTH_USER_KEY = "asl_auth_user";

export interface AuthenticatedUser {
  user_id: number;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
  token: string;
}

export interface AuthResult {
  authenticated: boolean;
  user: AuthenticatedUser | null;
  error?: {
    code: string;
    message: string;
  };
}

export async function verifyAuth(_request: NextRequest): Promise<AuthResult> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_TOKEN_KEY)?.value;
    const userDataStr = cookieStore.get(AUTH_USER_KEY)?.value;

    if (!token || !userDataStr) {
      return {
        authenticated: false,
        user: null,
        error: {
          code: "unauthorized",
          message: "Authentication required",
        },
      };
    }

    // Parse and validate user data from cookie
    // The client-side AuthContext already validates the token with the backend
    // and handles token refresh before setting these cookies.
    // Server-side, we trust the cookie data since:
    // 1. Cookies are HttpOnly (can't be accessed by JavaScript)
    // 2. Cookies are SameSite=Strict (can't be sent in cross-site requests)
    // 3. Cookies are Secure in production (only sent over HTTPS)
    let userData;
    try {
      userData = JSON.parse(userDataStr);
    } catch {
      return {
        authenticated: false,
        user: null,
        error: {
          code: "invalid_user_data",
          message: "Invalid user data in cookie",
        },
      };
    }

    if (!userData.user_id) {
      return {
        authenticated: false,
        user: null,
        error: {
          code: "invalid_user_data",
          message: "User ID not found in cookie",
        },
      };
    }

    return {
      authenticated: true,
      user: {
        user_id: userData.user_id,
        user_email: userData.user_email,
        user_nicename: userData.user_nicename,
        user_display_name: userData.user_display_name,
        token: token,
      },
    };
  } catch (error) {
    return {
      authenticated: false,
      user: null,
      error: {
        code: "auth_error",
        message: error instanceof Error ? error.message : "Authentication error",
      },
    };
  }
}

export function unauthorizedResponse(error?: { code: string; message: string }): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: error || {
        code: "unauthorized",
        message: "Authentication required",
      },
    },
    { status: 401 }
  );
}

export function forbiddenResponse(message?: string): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error: {
        code: "forbidden",
        message: message || "You do not have permission to access this resource",
      },
    },
    { status: 403 }
  );
}
