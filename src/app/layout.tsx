import type { Metadata } from "next";
import { Inter, Cairo } from "next/font/google";
// import { Questrial } from "next/font/google"; // Hidden - can switch to Questrial if needed
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Arabic font - Cairo is a modern, clean Arabic font that works well for e-commerce
const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700"],
});

// Hidden Questrial font - uncomment to switch
// const questrial = Questrial({
//   variable: "--font-questrial",
//   subsets: ["latin"],
//   weight: "400",
// });

const accentGraphic = localFont({
  src: [
    {
      path: "../../public/fonts/AccentGraphic-Medium.woff2",
      weight: "400",
      style: "normal",
    },
  ],
  variable: "--font-accent-graphic",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aromatic Scents Lab",
  description: "Premium fragrances and perfumes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-clip">
      <body
        className={`${inter.variable} ${cairo.variable} ${accentGraphic.variable} antialiased overflow-x-clip`}
      >
        {children}
      </body>
    </html>
  );
}
