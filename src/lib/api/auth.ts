import { siteConfig } from "@/config/site";

const API_BASE = siteConfig.apiUrl;

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthUser {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

export interface AuthError {
  code: string;
  message: string;
  data?: {
    status: number;
  };
}

export interface LoginResponse {
  success: boolean;
  user?: AuthUser;
  error?: AuthError;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  user_id?: number;
  error?: AuthError;
}

export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_BASE}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: data.code || "login_failed",
          message: data.message || "Login failed. Please check your credentials.",
          data: { status: response.status },
        },
      };
    }

    return {
      success: true,
      user: {
        token: data.token,
        user_email: data.user_email,
        user_nicename: data.user_nicename,
        user_display_name: data.user_display_name,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "network_error",
        message: error instanceof Error ? error.message : "Network error occurred",
      },
    };
  }
}

export async function register(data: RegisterData): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_BASE}/wp-json/wp/v2/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        email: data.email,
        password: data.password,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: {
          code: result.code || "registration_failed",
          message: result.message || "Registration failed. Please try again.",
          data: { status: response.status },
        },
      };
    }

    return {
      success: true,
      message: "Registration successful! Please login with your credentials.",
      user_id: result.id,
    };
  } catch (error) {
    return {
      success: false,
      error: {
        code: "network_error",
        message: error instanceof Error ? error.message : "Network error occurred",
      },
    };
  }
}

export async function validateToken(token: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/wp-json/jwt-auth/v1/token/validate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}
