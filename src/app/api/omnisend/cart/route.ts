import { NextRequest, NextResponse } from "next/server";

/**
 * Server-side API route to create/update carts in Omnisend via REST API.
 *
 * Omnisend's built-in "Abandoned Cart" automation workflow requires cart
 * objects to exist in their system (created via the REST API). The
 * JavaScript snippet events show in Live View but do NOT create the cart
 * objects that the pre-built workflow monitors.
 *
 * This route bridges that gap for our headless WooCommerce frontend by
 * proxying cart data to Omnisend's v3 carts endpoint.
 */

const OMNISEND_API_URL = "https://api.omnisend.com/v3/carts";

function getApiKey(): string {
  return process.env.OMNISEND_API_KEY || "";
}

interface OmnisendCartProduct {
  cartProductID: string;
  productID: string;
  variantID: string;
  title: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  productUrl?: string;
}

interface OmnisendCartPayload {
  cartID: string;
  email: string;
  currency: string;
  cartSum: number;
  cartRecoveryUrl: string;
  products: OmnisendCartProduct[];
}

export async function POST(request: NextRequest) {
  const apiKey = getApiKey();
  if (!apiKey) {
    // Silently fail if API key not configured — don't break the cart flow
    return NextResponse.json({ success: true, skipped: true });
  }

  try {
    const body: OmnisendCartPayload = await request.json();

    // Validate required fields
    if (!body.cartID || !body.email || !body.products?.length) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: cartID, email, products" },
        { status: 400 }
      );
    }

    // Try to replace existing cart first, fall back to creating new one
    const replaceResponse = await fetch(`${OMNISEND_API_URL}/${body.cartID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({
        currency: body.currency,
        cartSum: body.cartSum,
        cartRecoveryUrl: body.cartRecoveryUrl,
        products: body.products,
      }),
    });

    if (replaceResponse.ok) {
      return NextResponse.json({ success: true, action: "updated" });
    }

    // If replace fails (cart doesn't exist yet), create a new one
    const createResponse = await fetch(OMNISEND_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify({
        cartID: body.cartID,
        email: body.email,
        currency: body.currency,
        cartSum: body.cartSum,
        cartRecoveryUrl: body.cartRecoveryUrl,
        products: body.products,
      }),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.text();
      console.error("[Omnisend Cart API] Failed to create cart:", errorData);
      // Don't fail the main cart flow — just log the error
      return NextResponse.json({ success: false, error: errorData }, { status: 200 });
    }

    return NextResponse.json({ success: true, action: "created" });
  } catch (error) {
    console.error("[Omnisend Cart API] Error:", error);
    // Don't fail the main cart flow
    return NextResponse.json({ success: true, skipped: true });
  }
}

/**
 * DELETE handler to remove a cart from Omnisend when the user completes
 * an order or clears their cart.
 */
export async function DELETE(request: NextRequest) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json({ success: true, skipped: true });
  }

  try {
    const { cartID } = await request.json();
    if (!cartID) {
      return NextResponse.json({ success: false, error: "Missing cartID" }, { status: 400 });
    }

    await fetch(`${OMNISEND_API_URL}/${cartID}`, {
      method: "DELETE",
      headers: { "X-API-KEY": apiKey },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Omnisend Cart API] Delete error:", error);
    return NextResponse.json({ success: true, skipped: true });
  }
}
