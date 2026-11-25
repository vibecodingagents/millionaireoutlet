import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | Luxury for less`, template: `%s | ${SITE_NAME}` },
  description: "Curated luxury deals and honest buying guides for US shoppers.",
  openGraph: { siteName: SITE_NAME, locale: "en_US", type: "website" },
};

// Public chrome (header/footer) lives in app/(site)/layout.tsx so /admin stays plain.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-white text-ink antialiased">{children}</body>
    </html>
  );
}
