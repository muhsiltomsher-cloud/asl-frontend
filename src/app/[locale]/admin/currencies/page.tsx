"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Save, X, RefreshCw } from "lucide-react";

interface Currency {
  code: string;
  label: string;
  symbol: string;
  decimals: number;
  rateFromAED: number;
  isDefault?: boolean;
}

interface CurrencyConfig {
  currencies: Currency[];
  defaultCurrency: string;
}

export default function CurrencyManagementPage() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [defaultCurrency, setDefaultCurrency] = useState<string>("AED");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [editingCurrency, setEditingCurrency] = useState<Currency | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState<Currency>({
    code: "",
    label: "",
    symbol: "",
    decimals: 2,
    rateFromAED: 1,
  });

  const fetchCurrencies = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/currencies");
      if (!response.ok) throw new Error("Failed to fetch currencies");
      const data: CurrencyConfig = await response.json();
      setCurrencies(data.currencies || []);
      setDefaultCurrency(data.defaultCurrency || "AED");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load currencies");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  const handleEdit = (currency: Currency) => {
    setEditingCurrency(currency);
    setFormData(currency);
    setIsAddingNew(false);
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingCurrency(null);
    setFormData({
      code: "",
      label: "",
      symbol: "",
      decimals: 2,
      rateFromAED: 1,
    });
  };

  const handleCancel = () => {
    setEditingCurrency(null);
    setIsAddingNew(false);
    setFormData({
      code: "",
      label: "",
      symbol: "",
      decimals: 2,
      rateFromAED: 1,
    });
  };

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const method = isAddingNew ? "POST" : "PUT";
      const response = await fetch("/api/currencies", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save currency");
      }

      await fetchCurrencies();
      handleCancel();
      showSuccess(isAddingNew ? "Currency added successfully" : "Currency updated successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save currency");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (code: string) => {
    if (!confirm(`Are you sure you want to delete ${code}?`)) return;

    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`/api/currencies?code=${code}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete currency");
      }

      await fetchCurrencies();
      showSuccess("Currency deleted successfully");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete currency");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (code: string) => {
    if (code === defaultCurrency) return;
    
    if (!confirm(`Are you sure you want to set ${code} as the default currency? This will recalculate all exchange rates relative to ${code}.`)) return;

    try {
      setSaving(true);
      setError(null);

      const response = await fetch("/api/currencies", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setDefault", code }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to set default currency");
      }

      await fetchCurrencies();
      showSuccess(`${code} is now the default currency`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to set default currency");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof Currency, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f6f2] p-8">
        <div className="mx-auto max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-gray-200 rounded" />
            <div className="h-64 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Currency Management</h1>
          <div className="flex gap-2">
            <button
              onClick={fetchCurrencies}
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
              disabled={saving}
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
            <button
              onClick={handleAddNew}
              className="flex items-center gap-2 rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900 transition-colors"
              disabled={saving || isAddingNew}
            >
              <Plus className="h-4 w-4" />
              Add Currency
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mb-6 rounded-lg bg-green-50 border border-green-200 p-4 text-green-700">
            {successMessage}
          </div>
        )}

        {(isAddingNew || editingCurrency) && (
          <div className="mb-6 rounded-lg bg-white p-6 shadow-sm border border-gray-200">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              {isAddingNew ? "Add New Currency" : `Edit ${editingCurrency?.code}`}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Currency Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="USD"
                  disabled={!isAddingNew}
                  maxLength={3}
                />
                <p className="mt-1 text-xs text-gray-500">
                  3-letter currency code (e.g., USD, EUR, GBP)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Label
                </label>
                <input
                  type="text"
                  value={formData.label}
                  onChange={(e) => handleInputChange("label", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="United States (USD)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Display name for the currency
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Symbol
                </label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => handleInputChange("symbol", e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  placeholder="$"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Currency symbol (e.g., $, EUR, BD)
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Decimal Places
                </label>
                <input
                  type="number"
                  value={formData.decimals}
                  onChange={(e) => handleInputChange("decimals", parseInt(e.target.value) || 0)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  min={0}
                  max={3}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Number of decimal places (0-3)
                </p>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exchange Rate (from {defaultCurrency})
                </label>
                <input
                  type="number"
                  value={formData.rateFromAED}
                  onChange={(e) => handleInputChange("rateFromAED", parseFloat(e.target.value) || 0)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  step="0.001"
                  min="0.001"
                  placeholder="1.00"
                />
                <p className="mt-1 text-xs text-gray-500">
                  How much of this currency equals 1 {defaultCurrency}. Example: 0.27 USD = 1 AED
                </p>
              </div>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors"
                disabled={saving}
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 rounded-lg bg-amber-800 px-4 py-2 text-sm font-medium text-white hover:bg-amber-900 transition-colors"
                disabled={saving}
              >
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : isAddingNew ? "Add Currency" : "Update Currency"}
              </button>
            </div>
          </div>
        )}

        <div className="rounded-lg bg-white shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">All Currencies</h2>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Label
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Symbol
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Decimals
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rate (from {defaultCurrency})
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currencies.map((currency) => (
                <tr key={currency.code} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {currency.code}
                    {currency.code === defaultCurrency && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                        BASE
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{currency.label}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{currency.symbol}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{currency.decimals}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{currency.rateFromAED}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(currency)}
                        className="rounded border border-gray-300 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                        title="Edit"
                        disabled={saving}
                      >
                        Edit
                      </button>
                      {currency.code !== defaultCurrency && (
                        <>
                          <button
                            onClick={() => handleSetDefault(currency.code)}
                            className="rounded border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700 hover:bg-amber-100 transition-colors"
                            title="Make Default"
                            disabled={saving}
                          >
                            Make Default
                          </button>
                          <button
                            onClick={() => handleDelete(currency.code)}
                            className="rounded border border-red-300 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete"
                            disabled={saving}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 rounded-lg bg-blue-50 border border-blue-200 p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">How Exchange Rates Work</h3>
          <p className="text-sm text-blue-700">
            Exchange rates are relative to {defaultCurrency} as the base currency. 
            For example, if 1 {defaultCurrency} = 0.27 USD, enter 0.27 as the rate for USD.
            The system will automatically convert prices from {defaultCurrency} to the selected currency.
          </p>
          <p className="text-sm text-blue-700 mt-2">
            <strong>Changing the default currency:</strong> Click &quot;Make Default&quot; on any currency to set it as the base. 
            All exchange rates will be automatically recalculated relative to the new base currency.
          </p>
        </div>
      </div>
    </div>
  );
}
