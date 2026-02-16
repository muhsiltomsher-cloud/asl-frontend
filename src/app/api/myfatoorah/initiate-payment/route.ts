import { NextRequest, NextResponse } from "next/server";
import { getEnvVar } from "@/lib/utils/loadEnv";

function parsePhoneForMyFatoorah(phone: string | undefined): { localNumber: string; countryCode: string } {
  if (!phone) return { localNumber: "", countryCode: "" };
  
  let normalized = phone.replace(/[\s\-\(\)]/g, "");
  
  let hasInternationalPrefix = false;
  if (normalized.startsWith("+")) {
    hasInternationalPrefix = true;
    normalized = normalized.substring(1);
  } else if (normalized.startsWith("00")) {
    hasInternationalPrefix = true;
    normalized = normalized.substring(2);
  }
  
  const countryCodes = [
    "971", "966", "965", "973", "968", "974", "962", "972",
    "963", "964", "967", "970", "961", "960",
    "880", "886", "852", "853", "855", "856",
    "212", "213", "216", "218",
    "351", "352", "353", "354", "355", "356", "357", "358", "359",
    "370", "371", "372", "373", "374", "375", "380", "381",
    "385", "386", "389",
    "420", "421",
    "992", "993", "994", "995", "996", "998",
    "20", "27",
    "30", "31", "32", "33", "34", "36", "39",
    "40", "41", "43", "44", "45", "46", "47", "48", "49",
    "51", "52", "53", "54", "55", "56", "57", "58",
    "60", "61", "62", "63", "64", "65", "66",
    "81", "82", "84", "86",
    "90", "91", "92", "93", "94", "95", "98",
    "1", "7"
  ];
  
  let detectedCode = "";
  if (hasInternationalPrefix) {
    for (const code of countryCodes) {
      if (normalized.startsWith(code)) {
        detectedCode = code;
        normalized = normalized.substring(code.length);
        break;
      }
    }
  }
  
  if (normalized.startsWith("0")) {
    normalized = normalized.substring(1);
  }
  
  return {
    localNumber: normalized.substring(0, 11),
    countryCode: detectedCode ? `+${detectedCode}` : "",
  };
}

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

interface InitiatePaymentRequest {
  order_id: number;
  order_key: string;
  invoice_value: number;
  customer_name: string;
  customer_email?: string;
  customer_phone?: string;
  currency_iso?: string;
  language?: string;
  callback_url: string;
  error_url: string;
}

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

    const body: InitiatePaymentRequest = await request.json();
    
    console.log("MyFatoorah initiate-payment request:", {
      order_id: body.order_id,
      invoice_value: body.invoice_value,
      currency_iso: body.currency_iso,
    });
    
    const {
      order_id,
      order_key,
      invoice_value,
      customer_name,
      customer_email,
      customer_phone,
      currency_iso = "KWD",
      language = "en",
      callback_url,
      error_url,
    } = body;

    if (!order_id || !invoice_value || !customer_name || !callback_url || !error_url) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "missing_params",
            message: "Missing required parameters: order_id, invoice_value, customer_name, callback_url, error_url",
          },
        },
        { status: 400 }
      );
    }

    const parsedPhone = parsePhoneForMyFatoorah(customer_phone);

    const paymentData: Record<string, unknown> = {
      NotificationOption: "LNK",
      InvoiceValue: invoice_value,
      DisplayCurrencyIso: currency_iso,
      CustomerName: customer_name,
      CustomerEmail: customer_email || "",
      CustomerMobile: parsedPhone.localNumber,
      ...(parsedPhone.countryCode && { MobileCountryCode: parsedPhone.countryCode }),
      CallBackUrl: `${callback_url}?order_id=${order_id}&order_key=${order_key}`,
      ErrorUrl: `${error_url}?order_id=${order_id}&order_key=${order_key}`,
      Language: language,
      CustomerReference: `WC-${order_id}`,
      UserDefinedField: order_key,
    };

    const response = await fetch(`${getMyFatoorahApiBaseUrl()}/v2/SendPayment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify(paymentData),
    });

    const data = await response.json();

    if (!response.ok || !data.IsSuccess) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: data.ValidationErrors?.[0]?.Name || "myfatoorah_error",
            message: data.ValidationErrors?.[0]?.Error || data.Message || "Failed to initiate payment",
          },
        },
        { status: response.status || 400 }
      );
    }

    return NextResponse.json({
      success: true,
      payment_url: data.Data?.InvoiceURL,
      invoice_id: data.Data?.InvoiceId,
    });
  } catch (error) {
    console.error("MyFatoorah initiate-payment error:", error);
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
