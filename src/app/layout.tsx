import type { Metadata } from "next";
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
  verification: {
    google: "f_mMaADw5xQDw862fP3PjCa-2conJWM6uY0H_goWpE8",
  },
  // iOS Home Screen Optimization
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aromatic Scents Lab",
  },
  // Additional mobile optimization
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-clip">
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
