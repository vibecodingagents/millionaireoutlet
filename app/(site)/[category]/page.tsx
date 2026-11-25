import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { publicClient } from "@/lib/supabase/public";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

async function load(slug: string) {
  const supabase = publicClient();
  const { data: category } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle();
  if (!category) return null;
  const { data: pages } = await supabase
    .from("pages")
    .select("title, slug, meta_description")
    .eq("category_id", category.id)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return { category, pages: pages ?? [] };
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await params;
  const data = await load(slug);
  if (!data) return {};
  return buildMetadata({ title: data.category.name, ...data.category }, `/${slug}`);
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const data = await load(slug);
  if (!data) notFound();
  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-2 text-3xl font-semibold">{data.category.name}</h1>
      {data.category.description && <p className="mb-8 text-neutral-600">{data.category.description}</p>}
      <ul className="space-y-4">
        {data.pages.map((p) => (
          <li key={p.slug}>
            <Link href={`/${slug}/${p.slug}`} className="text-lg font-medium hover:underline">{p.title}</Link>
            {p.meta_description && <p className="text-sm text-neutral-600">{p.meta_description}</p>}
          </li>
        ))}
        {!data.pages.length && <li className="text-neutral-500">Pages coming soon.</li>}
      </ul>
    </main>
  );
}
