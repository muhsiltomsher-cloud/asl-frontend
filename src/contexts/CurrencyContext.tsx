"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { getCookie, setCookie } from "cookies-next";
import { currencies as defaultCurrencies, siteConfig, API_BASE_CURRENCY, type Currency } from "@/config/site";

// Currency info type for dynamic currencies
export interface CurrencyInfo {
  code: string;
  label: string;
  symbol: string;
  decimals: number;
  rateFromAED: number;
}

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (price: string | number | null | undefined, showCode?: boolean) => string;
  formatCartPrice: (price: string | number | null | undefined, minorUnit?: number, showCode?: boolean) => string;
  convertPrice: (price: number, fromCurrency?: Currency) => number;
  getCurrencySymbol: () => string;
  getCurrencyInfo: () => CurrencyInfo;
  currencies: CurrencyInfo[];
  refreshCurrencies: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const CURRENCY_COOKIE_NAME = "wcml_currency";

// Initialize currency from cookie (runs once on first render)
function getInitialCurrency(availableCurrencies: CurrencyInfo[]): Currency {
  if (typeof window === "undefined") {
    return siteConfig.defaultCurrency;
  }
  const savedCurrency = getCookie(CURRENCY_COOKIE_NAME) as Currency | undefined;
  if (savedCurrency && availableCurrencies.some((c) => c.code === savedCurrency)) {
    return savedCurrency;
  }
  return siteConfig.defaultCurrency;
}

// Convert default currencies to CurrencyInfo format
const defaultCurrencyList: CurrencyInfo[] = defaultCurrencies.map(c => ({
  code: c.code,
  label: c.label,
  symbol: c.symbol,
  decimals: c.decimals,
  rateFromAED: c.rateFromAED,
}));

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currencies, setCurrencies] = useState<CurrencyInfo[]>(defaultCurrencyList);
  const [currency, setCurrencyState] = useState<Currency>(() => getInitialCurrency(defaultCurrencyList));

  // Fetch currencies from API
  const refreshCurrencies = useCallback(async () => {
    try {
      const response = await fetch("/api/currencies");
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setCurrencies(data);
        }
      }
    } catch (error) {
      console.error("Failed to fetch currencies:", error);
      // Keep using default currencies on error
    }
  }, []);

  // Fetch currencies on mount using a separate effect with empty deps
  useEffect(() => {
    const loadCurrencies = async () => {
      try {
        const response = await fetch("/api/currencies");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data) && data.length > 0) {
            setCurrencies(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch currencies:", error);
      }
    };
    loadCurrencies();
  }, []);

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    setCookie(CURRENCY_COOKIE_NAME, newCurrency, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }, []);

  const getCurrencyInfo = useCallback((): CurrencyInfo => {
    return currencies.find((c) => c.code === currency) || currencies[0] || defaultCurrencyList[0];
  }, [currency, currencies]);

  const getCurrencySymbol = useCallback(() => {
    return getCurrencyInfo().symbol;
  }, [getCurrencyInfo]);

  const convertPrice = useCallback(
    (price: number, fromCurrency: Currency = API_BASE_CURRENCY): number => {
      if (price === 0) return 0;
    
      const fromCurrencyInfo = currencies.find((c) => c.code === fromCurrency);
      const toCurrencyInfo = getCurrencyInfo();
    
      if (!fromCurrencyInfo || !toCurrencyInfo) return price;
      if (fromCurrency === currency) return price;
    
      const priceInAED = price / fromCurrencyInfo.rateFromAED;
      const convertedPrice = priceInAED * toCurrencyInfo.rateFromAED;
    
      return convertedPrice;
    },
    [currency, currencies, getCurrencyInfo]
  );

  const formatPrice = useCallback(
    (price: string | number | null | undefined, showCode = true) => {
      const currencyInfo = getCurrencyInfo();
      
      // Handle undefined, null, or empty price
      if (price === undefined || price === null || price === "") {
        return "—";
      }
      
      const numericPrice = typeof price === "string" ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : price;

      if (isNaN(numericPrice)) {
        return String(price);
      }

      const formattedNumber = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: currencyInfo.decimals,
        maximumFractionDigits: currencyInfo.decimals,
      }).format(numericPrice);

      return showCode ? `${formattedNumber} ${currencyInfo.code}` : `${currencyInfo.symbol}${formattedNumber}`;
    },
    [getCurrencyInfo]
  );

  const formatCartPrice = useCallback(
    (price: string | number | null | undefined, minorUnit = 2, showCode = true) => {
      const currencyInfo = getCurrencyInfo();
      
      // Handle undefined, null, or empty price
      if (price === undefined || price === null || price === "") {
        return "—";
      }
      
      const numericPrice = typeof price === "string" ? parseFloat(price.replace(/[^0-9.-]+/g, "")) : price;

      if (isNaN(numericPrice)) {
        return String(price);
      }

      const divisor = Math.pow(10, minorUnit);
      const convertedPrice = numericPrice / divisor;

      const formattedNumber = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: currencyInfo.decimals,
        maximumFractionDigits: currencyInfo.decimals,
      }).format(convertedPrice);

      return showCode ? `${formattedNumber} ${currencyInfo.code}` : `${currencyInfo.symbol}${formattedNumber}`;
    },
    [getCurrencyInfo]
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        formatCartPrice,
        convertPrice,
        getCurrencySymbol,
        getCurrencyInfo,
        currencies,
        refreshCurrencies,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
