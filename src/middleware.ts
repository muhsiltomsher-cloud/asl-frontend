import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware to detect the locale from the URL path and set it as a header.
 * This allows the root layout to read the locale and set the correct
 * HTML lang attribute (fixes Arabic pages having lang="en").
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const pathSegments = pathname.split("/").filter(Boolean);
  const locale = pathSegments[0] === "ar" ? "ar" : "en";

  const response = NextResponse.next();
  response.headers.set("x-locale", locale);
  return response;
}

export const config = {
  // Match all pages except static files, API routes, and Next.js internals
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|cms-media|robots.txt|sitemap.xml).*)"],
};
