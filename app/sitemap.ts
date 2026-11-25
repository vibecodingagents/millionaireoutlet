import type { MetadataRoute } from "next";
import { publicClient } from "@/lib/supabase/public";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

const STATIC_PATHS = ["/about", "/contact", "/affiliate-disclosure", "/privacy"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = publicClient();
  const [{ data: categories }, { data: pages }] = await Promise.all([
    supabase.from("categories").select("id, slug, updated_at"),
    supabase.from("pages").select("slug, category_id, updated_at, canonical_url").eq("status", "published").eq("noindex", false),
  ]);
  const bySlug = new Map(categories?.map((c) => [c.id, c.slug]));
  return [
    { url: SITE_URL },
    ...(categories ?? []).map((c) => ({ url: `${SITE_URL}/${c.slug}`, lastModified: c.updated_at })),
    ...(pages ?? [])
      // Pages that point their canonical elsewhere are left out of the sitemap.
      .filter((p) => bySlug.has(p.category_id))
      .map((p) => ({ url: `${SITE_URL}/${bySlug.get(p.category_id)}/${p.slug}`, lastModified: p.updated_at, canonical: p.canonical_url }))
      .filter((p) => !p.canonical || p.canonical === p.url)
      .map(({ url, lastModified }) => ({ url, lastModified })),
    ...STATIC_PATHS.map((p) => ({ url: `${SITE_URL}${p}` })),
  ];
}
