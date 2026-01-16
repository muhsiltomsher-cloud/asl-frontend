import { NextRequest, NextResponse } from "next/server";
import { getEnvVar } from "@/lib/utils/loadEnv";

function getMyFatoorahApiBaseUrl(): string {
  if (getEnvVar("MYFATOORAH_TEST_MODE") === "true") {
    return "https://apitest.myfatoorah.com";
  }
  
  const country = (getEnvVar("MYFATOORAH_COUNTRY") || "KWT").toUpperCase();
  
  switch (country) {
    case "AE":
    case "UAE":
      return "https://api-ae.myfatoorah.com";
    case "SA":
    case "SAU":
      return "https://api-sa.myfatoorah.com";
    case "QA":
    case "QAT":
      return "https://api-qa.myfatoorah.com";
    case "EG":
    case "EGY":
      return "https://api-eg.myfatoorah.com";
    case "PORTAL":
    case "MAIN":
    case "KW":
    case "KWT":
    case "BH":
    case "BHR":
    case "JO":
    case "JOR":
    case "OM":
    case "OMN":
    default:
      return "https://api.myfatoorah.com";
  }
}

interface MakeRefundRequest {
  payment_id?: string;
  invoice_id?: string;
  amount: number;
  comment?: string;
  service_charge_on_customer?: boolean;
}

interface MakeRefundResponse {
  IsSuccess: boolean;
  Message: string;
  ValidationErrors: Array<{ Name: string; Error: string }> | null;
  Data: {
    Key: string;
    RefundId: number;
    RefundReference: string;
    Amount: number;
    Comment: string;
  } | null;
}

interface GetRefundStatusResponse {
  IsSuccess: boolean;
  Message: string;
  ValidationErrors: Array<{ Name: string; Error: string }> | null;
  Data: {
    RefundStatusResult: Array<{
      RefundId: number;
      RefundStatus: "Refunded" | "Canceled" | "Pending";
      InvoiceId: number;
      Amount: number;
      RefundReference: string;
      RefundAmount: number;
    }>;
  } | null;
}

// POST - Make a refund request
export async function POST(request: NextRequest) {
  try {
    const apiKey = getEnvVar("MYFATOORAH_API_KEY");
    
    if (!apiKey) {
      console.error("MyFatoorah API Error: MYFATOORAH_API_KEY environment variable is not configured");
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "missing_api_key",
            message: "MyFatoorah API key is not configured",
          },
        },
        { status: 500 }
      );
    }

    const body: MakeRefundRequest = await request.json();

    if (!body.payment_id && !body.invoice_id) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "missing_key",
            message: "Either payment_id or invoice_id is required",
          },
        },
        { status: 400 }
      );
    }

    if (!body.amount || body.amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "invalid_amount",
            message: "Amount must be greater than 0",
          },
        },
        { status: 400 }
      );
    }

    const keyType = body.payment_id ? "PaymentId" : "InvoiceId";
    const key = body.payment_id || body.invoice_id;

    console.log("MyFatoorah refund request:", { keyType, key, amount: body.amount });

    const url = `${getMyFatoorahApiBaseUrl()}/v2/MakeRefund`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        KeyType: keyType,
        Key: key,
        Amount: body.amount,
        Comment: body.comment || "Refund requested via API",
        ServiceChargeOnCustomer: body.service_charge_on_customer || false,
      }),
    });

    const data: MakeRefundResponse = await response.json();

    console.log("MyFatoorah refund response:", {
      isSuccess: data.IsSuccess,
      refundId: data.Data?.RefundId,
      refundReference: data.Data?.RefundReference,
    });

    if (!response.ok || !data.IsSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: data.ValidationErrors?.[0]?.Name || "refund_error",
            message: data.ValidationErrors?.[0]?.Error || data.Message || "Failed to process refund",
          },
        },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      refund_id: data.Data?.RefundId,
      refund_reference: data.Data?.RefundReference,
      amount: data.Data?.Amount,
      comment: data.Data?.Comment,
      message: "Refund request submitted successfully. It will be processed by MyFatoorah finance team.",
    });
  } catch (error) {
    console.error("MyFatoorah refund error:", error);
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

// GET - Get refund status
export async function GET(request: NextRequest) {
  try {
    const apiKey = getEnvVar("MYFATOORAH_API_KEY");
    
    if (!apiKey) {
      console.error("MyFatoorah API Error: MYFATOORAH_API_KEY environment variable is not configured");
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "missing_api_key",
            message: "MyFatoorah API key is not configured",
          },
        },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const refundId = searchParams.get("refund_id");
    const refundReference = searchParams.get("refund_reference");
    const invoiceId = searchParams.get("invoice_id");

    if (!refundId && !refundReference && !invoiceId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "missing_key",
            message: "Either refund_id, refund_reference, or invoice_id is required",
          },
        },
        { status: 400 }
      );
    }

    let keyType: string;
    let key: string;

    if (refundId) {
      keyType = "RefundId";
      key = refundId;
    } else if (refundReference) {
      keyType = "RefundReference";
      key = refundReference;
    } else {
      keyType = "InvoiceId";
      key = invoiceId!;
    }

    console.log("MyFatoorah get refund status request:", { keyType, key });

    const url = `${getMyFatoorahApiBaseUrl()}/v2/GetRefundStatus`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        KeyType: keyType,
        Key: key,
      }),
    });

    const data: GetRefundStatusResponse = await response.json();

    console.log("MyFatoorah get refund status response:", {
      isSuccess: data.IsSuccess,
      refundCount: data.Data?.RefundStatusResult?.length,
    });

    if (!response.ok || !data.IsSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: data.ValidationErrors?.[0]?.Name || "refund_status_error",
            message: data.ValidationErrors?.[0]?.Error || data.Message || "Failed to get refund status",
          },
        },
        { status: response.status || 400 }
      );
    }

    const refunds = data.Data?.RefundStatusResult?.map((refund) => ({
      refund_id: refund.RefundId,
      refund_status: refund.RefundStatus.toLowerCase(),
      invoice_id: refund.InvoiceId,
      amount: refund.Amount,
      refund_reference: refund.RefundReference,
      refund_amount: refund.RefundAmount,
    })) || [];

    return NextResponse.json({
      success: true,
      refunds,
    });
  } catch (error) {
    console.error("MyFatoorah get refund status error:", error);
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
