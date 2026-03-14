import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SiteLoader from "@/components/layout/SiteLoader";
import PageTransitionProvider from "@/components/layout/PageTransitionProvider";

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
      <body className="antialiased">
        <PageTransitionProvider>
          <SiteLoader />
          <Header />
          <main>{children}</main>
          <Footer />
        </PageTransitionProvider>
      </body>
    </html>
  );
}
