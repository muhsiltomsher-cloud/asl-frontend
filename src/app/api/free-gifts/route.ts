import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

const API_BASE = siteConfig.apiUrl;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const currency = searchParams.get("currency");
    const locale = searchParams.get("locale");

    let url = `${API_BASE}/wp-json/asl-free-gifts/v1/rules`;
    const params: string[] = [];
    if (currency) {
      params.push(`currency=${encodeURIComponent(currency)}`);
    }
    if (locale) {
      params.push(`lang=${encodeURIComponent(locale)}`);
    }
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60,
        tags: ["free-gifts"],
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "api_error",
            message: "Failed to fetch free gift rules",
          },
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      rules: data.rules || [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "network_error",
          message: error instanceof Error ? error.message : "Network error occurred",
        },
      },
      { status: 500 }
    );
  }
}
