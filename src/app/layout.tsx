import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Money Math - Housing Calculators",
  description: "A couple tools I made to help with mortgage and rent vs buy calculations. Useful for when you're browsing Zillow and want to do the math.",
  keywords: "mortgage calculator, rent vs buy, housing math, mortgage payment, real estate calculator",
  authors: [{ name: "Jeff" }],
  openGraph: {
    title: "Mortgage Analyzer - Smart Real Estate Investment Analysis",
    description: "Professional mortgage analysis tool with interactive charts, ARM visualization, and real-time payment breakdowns.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mortgage Analyzer - Smart Real Estate Investment Analysis",
    description: "Professional mortgage analysis tool with interactive charts, ARM visualization, and real-time payment breakdowns.",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
