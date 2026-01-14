import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

const CF7_FORM_ID = "8005e27";
const API_BASE = `${siteConfig.apiUrl}/wp-json/contact-form-7/v1/contact-forms`;

interface NewsletterFormData {
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: NewsletterFormData = await request.json();

    if (!body.email) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "missing_email",
            message: "Email address is required.",
          },
        },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "invalid_email",
            message: "Please enter a valid email address.",
          },
        },
        { status: 400 }
      );
    }

    const formData = new FormData();
    formData.append("your-email", body.email);

    const url = `${API_BASE}/${CF7_FORM_ID}/feedback`;

    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.status === "mail_sent") {
      return NextResponse.json({
        success: true,
        message: data.message || "Thank you for subscribing to our newsletter!",
      });
    }

    if (data.status === "validation_failed") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "validation_failed",
            message: data.message || "Please check your email address.",
            invalidFields: data.invalid_fields || [],
          },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: data.status || "subscription_error",
          message: data.message || "Failed to subscribe. Please try again.",
        },
      },
      { status: response.ok ? 400 : response.status }
    );
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "network_error",
          message: error instanceof Error ? error.message : "Network error occurred. Please try again.",
        },
      },
      { status: 500 }
    );
  }
}
