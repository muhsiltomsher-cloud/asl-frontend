export interface CountryPhoneConfig {
  code: string;
  dialCode: string;
  minLength: number;
  maxLength: number;
}

export const countryPhoneConfigs: CountryPhoneConfig[] = [
  { code: "AE", dialCode: "+971", minLength: 9, maxLength: 9 },
  { code: "SA", dialCode: "+966", minLength: 9, maxLength: 9 },
  { code: "KW", dialCode: "+965", minLength: 8, maxLength: 8 },
  { code: "BH", dialCode: "+973", minLength: 8, maxLength: 8 },
  { code: "OM", dialCode: "+968", minLength: 8, maxLength: 8 },
  { code: "QA", dialCode: "+974", minLength: 8, maxLength: 8 },
  { code: "EG", dialCode: "+20", minLength: 10, maxLength: 10 },
  { code: "JO", dialCode: "+962", minLength: 9, maxLength: 9 },
  { code: "LB", dialCode: "+961", minLength: 7, maxLength: 8 },
  { code: "IQ", dialCode: "+964", minLength: 10, maxLength: 10 },
  { code: "SY", dialCode: "+963", minLength: 9, maxLength: 9 },
  { code: "PS", dialCode: "+970", minLength: 9, maxLength: 9 },
  { code: "YE", dialCode: "+967", minLength: 9, maxLength: 9 },
  { code: "LY", dialCode: "+218", minLength: 9, maxLength: 9 },
  { code: "TN", dialCode: "+216", minLength: 8, maxLength: 8 },
  { code: "DZ", dialCode: "+213", minLength: 9, maxLength: 9 },
  { code: "MA", dialCode: "+212", minLength: 9, maxLength: 9 },
  { code: "SD", dialCode: "+249", minLength: 9, maxLength: 9 },
  { code: "US", dialCode: "+1", minLength: 10, maxLength: 10 },
  { code: "GB", dialCode: "+44", minLength: 10, maxLength: 10 },
  { code: "CA", dialCode: "+1", minLength: 10, maxLength: 10 },
  { code: "AU", dialCode: "+61", minLength: 9, maxLength: 9 },
  { code: "DE", dialCode: "+49", minLength: 10, maxLength: 11 },
  { code: "FR", dialCode: "+33", minLength: 9, maxLength: 9 },
  { code: "IT", dialCode: "+39", minLength: 9, maxLength: 10 },
  { code: "ES", dialCode: "+34", minLength: 9, maxLength: 9 },
  { code: "NL", dialCode: "+31", minLength: 9, maxLength: 9 },
  { code: "BE", dialCode: "+32", minLength: 8, maxLength: 9 },
  { code: "CH", dialCode: "+41", minLength: 9, maxLength: 9 },
  { code: "AT", dialCode: "+43", minLength: 10, maxLength: 11 },
  { code: "SE", dialCode: "+46", minLength: 9, maxLength: 9 },
  { code: "NO", dialCode: "+47", minLength: 8, maxLength: 8 },
  { code: "DK", dialCode: "+45", minLength: 8, maxLength: 8 },
  { code: "FI", dialCode: "+358", minLength: 9, maxLength: 10 },
  { code: "PL", dialCode: "+48", minLength: 9, maxLength: 9 },
  { code: "PT", dialCode: "+351", minLength: 9, maxLength: 9 },
  { code: "GR", dialCode: "+30", minLength: 10, maxLength: 10 },
  { code: "TR", dialCode: "+90", minLength: 10, maxLength: 10 },
  { code: "IN", dialCode: "+91", minLength: 10, maxLength: 10 },
  { code: "PK", dialCode: "+92", minLength: 10, maxLength: 10 },
  { code: "BD", dialCode: "+880", minLength: 10, maxLength: 10 },
  { code: "PH", dialCode: "+63", minLength: 10, maxLength: 10 },
  { code: "ID", dialCode: "+62", minLength: 9, maxLength: 12 },
  { code: "MY", dialCode: "+60", minLength: 9, maxLength: 10 },
  { code: "SG", dialCode: "+65", minLength: 8, maxLength: 8 },
  { code: "TH", dialCode: "+66", minLength: 9, maxLength: 9 },
  { code: "VN", dialCode: "+84", minLength: 9, maxLength: 10 },
  { code: "JP", dialCode: "+81", minLength: 10, maxLength: 10 },
  { code: "KR", dialCode: "+82", minLength: 9, maxLength: 10 },
  { code: "CN", dialCode: "+86", minLength: 11, maxLength: 11 },
  { code: "HK", dialCode: "+852", minLength: 8, maxLength: 8 },
  { code: "TW", dialCode: "+886", minLength: 9, maxLength: 9 },
  { code: "NZ", dialCode: "+64", minLength: 8, maxLength: 9 },
  { code: "ZA", dialCode: "+27", minLength: 9, maxLength: 9 },
  { code: "NG", dialCode: "+234", minLength: 10, maxLength: 10 },
  { code: "KE", dialCode: "+254", minLength: 9, maxLength: 9 },
  { code: "BR", dialCode: "+55", minLength: 10, maxLength: 11 },
  { code: "MX", dialCode: "+52", minLength: 10, maxLength: 10 },
  { code: "AR", dialCode: "+54", minLength: 10, maxLength: 10 },
  { code: "CL", dialCode: "+56", minLength: 9, maxLength: 9 },
  { code: "CO", dialCode: "+57", minLength: 10, maxLength: 10 },
  { code: "RU", dialCode: "+7", minLength: 10, maxLength: 10 },
  { code: "UA", dialCode: "+380", minLength: 9, maxLength: 9 },
];

export function getPhoneConfigByCountry(countryCode: string): CountryPhoneConfig {
  return (
    countryPhoneConfigs.find((c) => c.code === countryCode) || {
      code: countryCode,
      dialCode: "+971",
      minLength: 7,
      maxLength: 15,
    }
  );
}

export function getDialCodeByCountry(countryCode: string): string {
  return getPhoneConfigByCountry(countryCode).dialCode;
}

export function parsePhoneNumber(phone: string): { dialCode: string; localNumber: string } {
  if (!phone) return { dialCode: "", localNumber: "" };

  const cleaned = phone.replace(/[\s\-()]/g, "");

  if (cleaned.startsWith("+")) {
    const sortedConfigs = [...countryPhoneConfigs].sort(
      (a, b) => b.dialCode.length - a.dialCode.length
    );
    for (const config of sortedConfigs) {
      if (cleaned.startsWith(config.dialCode)) {
        return {
          dialCode: config.dialCode,
          localNumber: cleaned.slice(config.dialCode.length),
        };
      }
    }
    const dialMatch = cleaned.match(/^(\+\d{1,4})/);
    if (dialMatch) {
      return {
        dialCode: dialMatch[1],
        localNumber: cleaned.slice(dialMatch[1].length),
      };
    }
  }

  if (cleaned.startsWith("00")) {
    const withPlus = "+" + cleaned.slice(2);
    return parsePhoneNumber(withPlus);
  }

  return { dialCode: "", localNumber: cleaned };
}

export function formatPhoneWithCountryCode(dialCode: string, localNumber: string): string {
  const digitsOnly = localNumber.replace(/\D/g, "");
  if (!digitsOnly) return "";
  return `${dialCode}${digitsOnly}`;
}

export interface PhoneValidationResult {
  isValid: boolean;
  error?: string;
  errorAr?: string;
}

export function validatePhoneNumber(
  localNumber: string,
  countryCode: string
): PhoneValidationResult {
  const digitsOnly = localNumber.replace(/\D/g, "");

  if (!digitsOnly) {
    return { isValid: false, error: "Phone number is required", errorAr: "رقم الهاتف مطلوب" };
  }

  const config = getPhoneConfigByCountry(countryCode);

  if (digitsOnly.length < config.minLength) {
    return {
      isValid: false,
      error: `Phone number must be at least ${config.minLength} digits`,
      errorAr: `يجب أن يكون رقم الهاتف ${config.minLength} أرقام على الأقل`,
    };
  }

  if (digitsOnly.length > config.maxLength) {
    return {
      isValid: false,
      error: `Phone number must not exceed ${config.maxLength} digits`,
      errorAr: `يجب ألا يتجاوز رقم الهاتف ${config.maxLength} أرقام`,
    };
  }

  return { isValid: true };
}

export function detectCountryFromPhone(phone: string): string | null {
  const { dialCode } = parsePhoneNumber(phone);
  if (!dialCode) return null;
  const config = countryPhoneConfigs.find((c) => c.dialCode === dialCode);
  return config?.code || null;
}
