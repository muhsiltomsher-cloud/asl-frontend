import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Currency data file path - stored in the data directory
const DATA_DIR = path.join(process.cwd(), "data");
const CURRENCIES_FILE = path.join(DATA_DIR, "currencies.json");

// Default currencies (fallback if no custom currencies are set)
const DEFAULT_CURRENCIES = [
  { code: "AED", label: "UAE (AED)", symbol: "د.إ", decimals: 2, rateFromAED: 1 },
  { code: "BHD", label: "Bahrain (BHD)", symbol: "BD", decimals: 3, rateFromAED: 0.103 },
  { code: "KWD", label: "Kuwait (KWD)", symbol: "KD", decimals: 3, rateFromAED: 0.083 },
  { code: "OMR", label: "Oman (OMR)", symbol: "OMR", decimals: 3, rateFromAED: 0.105 },
  { code: "QAR", label: "Qatar (QAR)", symbol: "QR", decimals: 2, rateFromAED: 0.99 },
  { code: "SAR", label: "Saudi Arabia (SAR)", symbol: "SAR", decimals: 2, rateFromAED: 1.02 },
  { code: "USD", label: "United States (USD)", symbol: "$", decimals: 2, rateFromAED: 0.27 },
];

export interface CurrencyData {
  code: string;
  label: string;
  symbol: string;
  decimals: number;
  rateFromAED: number;
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Read currencies from file
async function readCurrencies(): Promise<CurrencyData[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(CURRENCIES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    // If file doesn't exist, return default currencies
    return DEFAULT_CURRENCIES;
  }
}

// Write currencies to file
async function writeCurrencies(currencies: CurrencyData[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(CURRENCIES_FILE, JSON.stringify(currencies, null, 2));
}

// GET - Retrieve all currencies
export async function GET() {
  try {
    const currencies = await readCurrencies();
    return NextResponse.json(currencies);
  } catch (error) {
    console.error("Failed to read currencies:", error);
    return NextResponse.json(
      { error: "Failed to read currencies" },
      { status: 500 }
    );
  }
}

// POST - Add a new currency
export async function POST(request: NextRequest) {
  try {
    const newCurrency: CurrencyData = await request.json();
    
    // Validate required fields
    if (!newCurrency.code || !newCurrency.label || !newCurrency.symbol) {
      return NextResponse.json(
        { error: "Missing required fields: code, label, symbol" },
        { status: 400 }
      );
    }
    
    // Validate rate
    if (typeof newCurrency.rateFromAED !== "number" || newCurrency.rateFromAED <= 0) {
      return NextResponse.json(
        { error: "Invalid exchange rate. Must be a positive number." },
        { status: 400 }
      );
    }
    
    const currencies = await readCurrencies();
    
    // Check if currency code already exists
    if (currencies.some(c => c.code === newCurrency.code)) {
      return NextResponse.json(
        { error: `Currency with code ${newCurrency.code} already exists` },
        { status: 400 }
      );
    }
    
    // Add default decimals if not provided
    if (typeof newCurrency.decimals !== "number") {
      newCurrency.decimals = 2;
    }
    
    currencies.push(newCurrency);
    await writeCurrencies(currencies);
    
    return NextResponse.json(newCurrency, { status: 201 });
  } catch (error) {
    console.error("Failed to add currency:", error);
    return NextResponse.json(
      { error: "Failed to add currency" },
      { status: 500 }
    );
  }
}

// PUT - Update an existing currency
export async function PUT(request: NextRequest) {
  try {
    const updatedCurrency: CurrencyData = await request.json();
    
    // Validate required fields
    if (!updatedCurrency.code) {
      return NextResponse.json(
        { error: "Currency code is required" },
        { status: 400 }
      );
    }
    
    // Validate rate
    if (typeof updatedCurrency.rateFromAED !== "number" || updatedCurrency.rateFromAED <= 0) {
      return NextResponse.json(
        { error: "Invalid exchange rate. Must be a positive number." },
        { status: 400 }
      );
    }
    
    const currencies = await readCurrencies();
    const index = currencies.findIndex(c => c.code === updatedCurrency.code);
    
    if (index === -1) {
      return NextResponse.json(
        { error: `Currency with code ${updatedCurrency.code} not found` },
        { status: 404 }
      );
    }
    
    currencies[index] = updatedCurrency;
    await writeCurrencies(currencies);
    
    return NextResponse.json(updatedCurrency);
  } catch (error) {
    console.error("Failed to update currency:", error);
    return NextResponse.json(
      { error: "Failed to update currency" },
      { status: 500 }
    );
  }
}

// DELETE - Remove a currency
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    
    if (!code) {
      return NextResponse.json(
        { error: "Currency code is required" },
        { status: 400 }
      );
    }
    
    // Prevent deleting AED (base currency)
    if (code === "AED") {
      return NextResponse.json(
        { error: "Cannot delete the base currency (AED)" },
        { status: 400 }
      );
    }
    
    const currencies = await readCurrencies();
    const index = currencies.findIndex(c => c.code === code);
    
    if (index === -1) {
      return NextResponse.json(
        { error: `Currency with code ${code} not found` },
        { status: 404 }
      );
    }
    
    currencies.splice(index, 1);
    await writeCurrencies(currencies);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete currency:", error);
    return NextResponse.json(
      { error: "Failed to delete currency" },
      { status: 500 }
    );
  }
}
