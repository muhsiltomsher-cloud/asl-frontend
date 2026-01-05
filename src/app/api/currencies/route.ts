import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { siteConfig } from "@/config/site";

// Currency data file path - stored in the data directory
const DATA_DIR = path.join(process.cwd(), "data");
const CURRENCIES_FILE = path.join(DATA_DIR, "currencies.json");
const CONFIG_FILE = path.join(DATA_DIR, "currency-config.json");

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

const DEFAULT_BASE_CURRENCY = "AED";

export interface CurrencyData {
  code: string;
  label: string;
  symbol: string;
  decimals: number;
  rateFromAED: number;
}

interface CurrencyConfig {
  defaultCurrency: string;
}

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Read currencies from file or WordPress API
async function readCurrencies(): Promise<CurrencyData[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(CURRENCIES_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    // If file doesn't exist, try to fetch from WordPress API
    try {
      const wpApiUrl = `${siteConfig.apiUrl}/wp-json/asl/v1/currencies`;
      const response = await fetch(wpApiUrl, {
        next: { revalidate: 60 },
        headers: { "Content-Type": "application/json" },
      });
      
      if (response.ok) {
        const currencies = await response.json();
        if (Array.isArray(currencies) && currencies.length > 0) {
          // Save to local file for future use
          await writeCurrencies(currencies);
          return currencies;
        }
      }
    } catch (wpError) {
      console.log("WordPress currencies API not available:", wpError);
    }
    
    // Return default currencies as fallback
    return DEFAULT_CURRENCIES;
  }
}

// Write currencies to file
async function writeCurrencies(currencies: CurrencyData[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(CURRENCIES_FILE, JSON.stringify(currencies, null, 2));
}

// Read currency config (default currency setting)
async function readConfig(): Promise<CurrencyConfig> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(CONFIG_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return { defaultCurrency: DEFAULT_BASE_CURRENCY };
  }
}

// Write currency config
async function writeConfig(config: CurrencyConfig): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// GET - Retrieve all currencies with default currency info
export async function GET() {
  try {
    const currencies = await readCurrencies();
    const config = await readConfig();
    
    return NextResponse.json({
      currencies,
      defaultCurrency: config.defaultCurrency,
    });
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

// PATCH - Set default currency
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, code } = body;
    
    if (action !== "setDefault") {
      return NextResponse.json(
        { error: "Invalid action. Only 'setDefault' is supported." },
        { status: 400 }
      );
    }
    
    if (!code) {
      return NextResponse.json(
        { error: "Currency code is required" },
        { status: 400 }
      );
    }
    
    const currencies = await readCurrencies();
    const config = await readConfig();
    
    // Find the currency to set as default
    const newDefaultCurrency = currencies.find(c => c.code === code);
    if (!newDefaultCurrency) {
      return NextResponse.json(
        { error: `Currency with code ${code} not found` },
        { status: 404 }
      );
    }
    
    // Get the current default currency
    const oldDefaultCurrency = currencies.find(c => c.code === config.defaultCurrency);
    
    if (oldDefaultCurrency && newDefaultCurrency.code !== config.defaultCurrency) {
      // Recalculate all exchange rates relative to the new base currency
      // If old base was AED with rate 1, and new base is USD with rate 0.27
      // Then new AED rate = 1 / 0.27 = 3.7037
      const newBaseRate = newDefaultCurrency.rateFromAED;
      
      currencies.forEach(currency => {
        if (currency.code === code) {
          // New default currency has rate of 1
          currency.rateFromAED = 1;
        } else {
          // Recalculate rate: new_rate = old_rate / new_base_old_rate
          currency.rateFromAED = parseFloat((currency.rateFromAED / newBaseRate).toFixed(6));
        }
      });
      
      await writeCurrencies(currencies);
    }
    
    // Update the config with new default currency
    config.defaultCurrency = code;
    await writeConfig(config);
    
    return NextResponse.json({
      success: true,
      defaultCurrency: code,
      currencies,
    });
  } catch (error) {
    console.error("Failed to set default currency:", error);
    return NextResponse.json(
      { error: "Failed to set default currency" },
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
    
    const config = await readConfig();
    
    // Prevent deleting the default/base currency
    if (code === config.defaultCurrency) {
      return NextResponse.json(
        { error: `Cannot delete the base currency (${config.defaultCurrency}). Please set a different currency as default first.` },
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
