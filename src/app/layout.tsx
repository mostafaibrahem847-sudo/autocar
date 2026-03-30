import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SiteLoader from "@/components/layout/SiteLoader";
import PageTransitionProvider from "@/components/layout/PageTransitionProvider";
import ScrollSpeedometer from "@/components/layout/ScrollSpeedometer";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Autocar - Premium Automotive Dealership",
  description:
    "Discover premium vehicles at Autocar. Certified cars, competitive pricing, and an unmatched dealership experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <PageTransitionProvider>
          <SiteLoader />
          <ScrollSpeedometer />
          <Header />
          <main>{children}</main>
          <Footer />
        </PageTransitionProvider>
      </body>
    </html>
  );
}