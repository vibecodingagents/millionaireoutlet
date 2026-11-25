import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} | Luxury for less`, template: `%s | ${SITE_NAME}` },
  description: "Curated luxury deals and honest buying guides.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-US">
      <body className="bg-white text-neutral-900 antialiased">
        <header className="border-b">
          <div className="mx-auto flex max-w-4xl items-center p-4">
            <Link href="/" className="text-lg font-semibold">{SITE_NAME}</Link>
          </div>
        </header>
        {children}
        <footer className="mt-16 border-t p-6 text-center text-sm text-neutral-500">
          We may earn a commission if you buy through links on this site, at no extra cost to you.
        </footer>
      </body>
    </html>
  );
}
