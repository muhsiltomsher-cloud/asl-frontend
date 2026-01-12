import { NextResponse } from "next/server";
import { getEnvVar } from "@/lib/utils/loadEnv";

export async function GET() {
  return NextResponse.json({
    MYFATOORAH_API_KEY: getEnvVar("MYFATOORAH_API_KEY") ? "SET" : "MISSING",
    TABBY_SECRET_KEY: getEnvVar("TABBY_SECRET_KEY") ? "SET" : "MISSING",
    TABBY_MERCHANT_CODE: getEnvVar("TABBY_MERCHANT_CODE") ? "SET" : "MISSING",
    TAMARA_API_TOKEN: getEnvVar("TAMARA_API_TOKEN") ? "SET" : "MISSING",
    WC_CONSUMER_KEY: getEnvVar("WC_CONSUMER_KEY") ? "SET" : "MISSING",
    WC_CONSUMER_SECRET: getEnvVar("WC_CONSUMER_SECRET") ? "SET" : "MISSING",
  });
}
