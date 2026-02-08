import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";

export const metadata: Metadata = {
    title: "Pilot - Find Your Perfect Flight",
    description: "Search and book flights across Algeria and the world. Compare prices, find the best deals, and fly with confidence.",
    keywords: ["flights", "Algeria", "travel", "booking", "Algiers", "DZD"],
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className={GeistSans.className}>
            <body className="min-h-screen">
                {children}
            </body>
        </html>
    );
}
