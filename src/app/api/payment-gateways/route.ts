import { NextResponse } from "next/server";
import { siteConfig } from "@/config/site";

const STORE_API_BASE = `${siteConfig.apiUrl}/wp-json/wc/store/v1`;

const PAYMENT_METHOD_DETAILS: Record<string, { title: string; description: string }> = {
  myfatoorah_v2: {
    title: "Credit/Debit Card",
    description: "Pay securely with your credit or debit card via MyFatoorah",
  },
  tabby_installments: {
    title: "Tabby - Pay in Installments",
    description: "Split your purchase into 4 interest-free payments",
  },
  "tamara-gateway": {
    title: "Tamara - Buy Now Pay Later",
    description: "Pay in easy installments with Tamara",
  },
  cod: {
    title: "Cash on Delivery",
    description: "Pay with cash upon delivery",
  },
  bacs: {
    title: "Bank Transfer",
    description: "Make your payment directly into our bank account",
  },
};

interface CartResponse {
  payment_methods?: string[];
}

export async function GET() {
  try {
    const url = `${STORE_API_BASE}/cart`;
    
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        revalidate: 60,
      },
    });

    const data: CartResponse = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "payment_gateways_error",
            message: "Failed to get payment gateways.",
          },
        },
        { status: response.status }
      );
    }

    const paymentMethodIds = data.payment_methods || [];
    
    const gateways = paymentMethodIds.map((id: string, index: number) => {
      const details = PAYMENT_METHOD_DETAILS[id] || {
        title: id.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        description: "",
      };
      return {
        id,
        title: details.title,
        description: details.description,
        method_title: details.title,
        order: index,
      };
    });

    return NextResponse.json({ 
      success: true, 
      gateways,
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
