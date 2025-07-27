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
  title: "Mortgage Analyzer - Smart Real Estate Investment Analysis",
  description: "Professional mortgage analysis tool with interactive charts, ARM visualization, and real-time payment breakdowns. Optimize your real estate investments with comprehensive breakeven analysis.",
  keywords: "mortgage calculator, real estate investment, ARM analysis, amortization chart, property investment, mortgage comparison, breakeven analysis",
  authors: [{ name: "Mortgage Analyzer" }],
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
