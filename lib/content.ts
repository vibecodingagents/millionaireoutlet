import { cache } from "react";
import { publicClient } from "@/lib/supabase/public";

// Public read helpers. RLS limits these to published content.
// cache() dedupes calls between generateMetadata and the page in one request.

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  updated_at: string;
};

export type PageCardRow = {
  title: string;
  slug: string;
  meta_description: string | null;
  og_image: string | null;
  updated_at: string;
  categories: { name: string; slug: string } | null;
};

const CARD_FIELDS = "title, slug, meta_description, og_image, updated_at, categories!inner(name, slug)";

// Supabase types the embedded relation loosely; normalize to a single object.
function normalize(rows: unknown[] | null): PageCardRow[] {
  return (rows ?? []).map((r) => {
    const row = r as PageCardRow & { categories: unknown };
    const cat = Array.isArray(row.categories) ? row.categories[0] : row.categories;
    return { ...row, categories: (cat as PageCardRow["categories"]) ?? null };
  });
}

export const getCategories = cache(async (): Promise<CategoryRow[]> => {
  const { data } = await publicClient().from("categories").select("*").order("name");
  return data ?? [];
});

export const getCategory = cache(async (slug: string): Promise<CategoryRow | null> => {
  const { data } = await publicClient().from("categories").select("*").eq("slug", slug).maybeSingle();
  return data;
});

export const getPage = cache(async (categoryId: string, slug: string) => {
  const { data } = await publicClient()
    .from("pages")
    .select("*")
    .eq("category_id", categoryId)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return data;
});

export async function getCategoryPages(categoryId: string) {
  const { data } = await publicClient()
    .from("pages")
    .select(CARD_FIELDS)
    .eq("category_id", categoryId)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return normalize(data);
}

export async function getLatestPages(limit = 6) {
  const { data } = await publicClient()
    .from("pages")
    .select(CARD_FIELDS)
    .eq("status", "published")
    .eq("noindex", false)
    .order("published_at", { ascending: false })
    .limit(limit);
  return normalize(data);
}

export async function getRelatedPages(categoryId: string, excludeSlug: string, limit = 3) {
  const { data } = await publicClient()
    .from("pages")
    .select(CARD_FIELDS)
    .eq("category_id", categoryId)
    .eq("status", "published")
    .eq("noindex", false)
    .neq("slug", excludeSlug)
    .order("published_at", { ascending: false })
    .limit(limit);
  return normalize(data);
}

export async function searchPages(q: string, limit = 30) {
  // Strip characters that have meaning in PostgREST filter syntax.
  const term = q.replace(/[%_,()*\\]/g, " ").trim().slice(0, 80);
  if (!term) return [];
  const { data } = await publicClient()
    .from("pages")
    .select(CARD_FIELDS)
    .eq("status", "published")
    .eq("noindex", false)
    .or(`title.ilike.%${term}%,meta_description.ilike.%${term}%`)
    .order("published_at", { ascending: false })
    .limit(limit);
  return normalize(data);
}
