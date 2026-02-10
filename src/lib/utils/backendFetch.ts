import { siteConfig } from "@/config/site";

const API_BASE = siteConfig.apiUrl;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const NO_CACHE_HEADERS: HeadersInit = {
  "Accept": "application/json",
  "Cache-Control": "no-cache, no-store, must-revalidate",
  "Pragma": "no-cache",
  "X-LiteSpeed-Cache-Control": "no-cache",
  "X-Requested-With": "XMLHttpRequest",
  "User-Agent": USER_AGENT,
};

export function backendHeaders(extra?: HeadersInit): HeadersInit {
  return {
    "Content-Type": "application/json",
    ...NO_CACHE_HEADERS,
    ...extra,
  };
}

export function backendAuthHeaders(token: string, extra?: HeadersInit): HeadersInit {
  return backendHeaders({
    "Authorization": `Bearer ${token}`,
    ...extra,
  });
}

export function noCacheUrl(url: string): string {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}_t=${Date.now()}`;
}

export async function safeJsonResponse(response: Response): Promise<Record<string, unknown>> {
  const text = await response.text();
  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    const isHtml = text.trim().startsWith("<!") || text.trim().startsWith("<html");
    const snippet = text.slice(0, 200).replace(/[\r\n]+/g, " ").trim();
    console.error(
      `[backendFetch] Non-JSON response (${response.status}): ${snippet}`
    );
    return {
      code: "invalid_response",
      message: isHtml
        ? "Backend returned an HTML page instead of JSON. The server may be blocking API requests. Please check server firewall/WAF settings and ensure /wp-json/* paths are not blocked or cached."
        : "Backend returned non-JSON response",
      _raw_length: text.length,
      _raw_snippet: snippet,
    };
  }
}

export { API_BASE, USER_AGENT };
