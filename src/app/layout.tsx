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
  title: "wut? - housing math tools",
  description: "ok so i kept doing mortgage math in my head while looking at houses online and it was annoying so i built these",
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
