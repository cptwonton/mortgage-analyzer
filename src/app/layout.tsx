import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/contexts/ThemeContext";
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
  title: "wut? - mortgage calculator",
  description: "mortgage math in your head was annoying so i built this",
  keywords: "mortgage calculator, housing math, mortgage payment, real estate calculator, investment property",
  authors: [{ name: "Jeff" }],
  openGraph: {
    title: "wut? - mortgage calculator",
    description: "mortgage math in your head was annoying so i built this",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "wut? - mortgage calculator",
    description: "mortgage math in your head was annoying so i built this",
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
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
