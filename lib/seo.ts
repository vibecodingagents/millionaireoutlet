import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://millionaireoutlet.com").replace(/\/$/, "");
export const SITE_NAME = "millionaireoutlet";

type SeoInput = {
  title: string;
  meta_title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
  og_image?: string | null;
  noindex?: boolean;
};

// Pages without their own og_image fall back to app/opengraph-image.tsx.
export function buildMetadata(input: SeoInput, path: string, type: "article" | "website" = "article"): Metadata {
  const title = input.meta_title || input.title;
  const url = input.canonical_url || `${SITE_URL}${path}`;
  return {
    // absolute: meta titles already follow "Keyword (Year) | millionaireoutlet" when set.
    title: input.meta_title ? { absolute: input.meta_title } : title,
    description: input.meta_description ?? undefined,
    alternates: { canonical: url },
    robots: input.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description: input.meta_description ?? undefined,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      ...(input.og_image ? { images: [{ url: input.og_image, width: 1200, height: 630 }] } : {}),
    },
    twitter: { card: "summary_large_image" },
  };
}
