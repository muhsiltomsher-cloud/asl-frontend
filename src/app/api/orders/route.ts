import { NextRequest, NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

const API_BASE = `${siteConfig.apiUrl}/wp-json/wc/v3`;
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY || process.env.NEXT_PUBLIC_WC_CONSUMER_KEY || "";
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET || process.env.NEXT_PUBLIC_WC_CONSUMER_SECRET || "";

function getBasicAuthParams(): string {
  return `consumer_key=${CONSUMER_KEY}&consumer_secret=${CONSUMER_SECRET}`;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const orderId = searchParams.get("orderId");
  const customerId = searchParams.get("customerId");
  const page = searchParams.get("page");
  const perPage = searchParams.get("per_page");
  const status = searchParams.get("status");

  try {
    let url: string;
    
    if (orderId) {
      url = `${API_BASE}/orders/${orderId}?${getBasicAuthParams()}`;
    } else if (customerId) {
      const params = new URLSearchParams();
      params.set("customer", customerId);
      if (page) params.set("page", page);
      if (perPage) params.set("per_page", perPage);
      if (status) params.set("status", status);
      url = `${API_BASE}/orders?${params.toString()}&${getBasicAuthParams()}`;
    } else {
      return NextResponse.json(
        { success: false, error: { code: "missing_params", message: "Order ID or Customer ID is required" } },
        { status: 400 }
      );
    }

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: data.code || "orders_error",
            message: data.message || "Failed to get orders.",
          },
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true, data });
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
