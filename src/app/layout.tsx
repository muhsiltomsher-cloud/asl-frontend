import type { Metadata } from "next";
import { headers } from "next/headers";
import { Inter, Noto_Sans_Arabic } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Arabic font - Noto Sans Arabic is a clean, modern Arabic font from Google
const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-sans-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aromatic Scents Lab | Premium Perfumes & Fragrances in UAE",
  description: "Aromatic Scents Lab offers premium perfumes, Arabian oud, body care, home fragrances & aromatic oils in the UAE. Shop luxury handcrafted scents online with free delivery.",
  metadataBase: new URL("https://aromaticscentslab.com"),
  openGraph: {
    title: "Aromatic Scents Lab | Premium Perfumes & Fragrances in UAE",
    description: "Aromatic Scents Lab offers premium perfumes, Arabian oud, body care, home fragrances & aromatic oils in the UAE. Shop luxury handcrafted scents online with free delivery.",
    url: "https://aromaticscentslab.com",
    siteName: "Aromatic Scents Lab",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Aromatic Scents Lab" }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aromatic Scents Lab | Premium Perfumes & Fragrances in UAE",
    description: "Aromatic Scents Lab offers premium perfumes, Arabian oud, body care, home fragrances & aromatic oils in the UAE.",
    images: ["/og-image.jpg"],
  },
  verification: {
    google: "f_mMaADw5xQDw862fP3PjCa-2conJWM6uY0H_goWpE8",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aromatic Scents Lab",
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read locale from middleware header to set correct HTML lang attribute
  // This fixes Arabic pages having lang="en" instead of lang="ar"
  const headersList = await headers();
  const locale = headersList.get("x-locale") || "en";
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} suppressHydrationWarning className="overflow-x-clip">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="dns-prefetch" href="https://cms.aromaticscentslab.com" />
        <link rel="preconnect" href="https://cms.aromaticscentslab.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://connect.facebook.net" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <link rel="dns-prefetch" href="https://analytics.tiktok.com" />
        <link rel="dns-prefetch" href="https://sc-static.net" />
      </head>
      <body
        suppressHydrationWarning
        className={`${inter.variable} ${notoSansArabic.variable} antialiased overflow-x-clip`}
      >
        {children}
      </body>
    </html>
  );
}
