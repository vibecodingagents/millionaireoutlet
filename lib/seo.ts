import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://millionaireoutlet.com";
export const SITE_NAME = "millionaireoutlet";

type SeoInput = {
  title: string;
  meta_title?: string | null;
  meta_description?: string | null;
  canonical_url?: string | null;
  og_image?: string | null;
  noindex?: boolean;
};

export function buildMetadata(input: SeoInput, path: string): Metadata {
  const title = input.meta_title || input.title;
  const url = input.canonical_url || `${SITE_URL}${path}`;
  return {
    title,
    description: input.meta_description ?? undefined,
    alternates: { canonical: url },
    robots: input.noindex ? { index: false, follow: false } : undefined,
    openGraph: {
      title,
      description: input.meta_description ?? undefined,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "article",
      images: input.og_image ? [input.og_image] : undefined,
    },
  };
}
