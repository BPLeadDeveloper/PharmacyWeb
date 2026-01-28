import type { Metadata } from "next";
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
  title: "Bharath Pharmacy - Online Medicine Delivery | Health Products | Lab Tests",
  description: "Order medicines online from Bharath Pharmacy. Get up to 25% off on medicines, health products, and book lab tests at home. Free delivery on orders above ₹499.",
  keywords: "online pharmacy, buy medicines online, health products, lab tests, medicine delivery, Bharath Pharmacy",
  icons: {
    icon: '/logo-mini.png',
  },
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
