import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { publicClient } from "@/lib/supabase/public";
import { buildMetadata, SITE_URL } from "@/lib/seo";

export const revalidate = 60;

async function load(categorySlug: string, slug: string) {
  const supabase = publicClient();
  const { data: category } = await supabase.from("categories").select("id, name, slug").eq("slug", categorySlug).maybeSingle();
  if (!category) return null;
  const { data: page } = await supabase
    .from("pages")
    .select("*")
    .eq("category_id", category.id)
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();
  return page ? { category, page } : null;
}

type Params = Promise<{ category: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, slug } = await params;
  const data = await load(category, slug);
  if (!data) return {};
  return buildMetadata(data.page, `/${category}/${slug}`);
}

export default async function ContentPage({ params }: { params: Params }) {
  const { category, slug } = await params;
  const data = await load(category, slug);
  if (!data) notFound();
  const { page } = data;
  const url = `${SITE_URL}/${category}/${slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: data.category.name, item: `${SITE_URL}/${category}` },
        { "@type": "ListItem", position: 3, name: page.title, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: page.title,
      description: page.meta_description ?? undefined,
      datePublished: page.published_at ?? undefined,
      dateModified: page.updated_at,
      mainEntityOfPage: url,
    },
    ...(page.schema_json ? [page.schema_json] : []),
  ];
  const blocks = (page.blocks ?? []) as { type: string; text?: string }[];
  return (
    <main className="mx-auto max-w-2xl p-6">
      <nav className="mb-4 text-sm text-neutral-500">
        <Link href="/">Home</Link> / <Link href={`/${category}`}>{data.category.name}</Link>
      </nav>
      <h1 className="mb-4 text-3xl font-semibold">{page.title}</h1>
      <p className="mb-6 text-sm text-neutral-500">
        We may earn a commission if you buy through links on this page, at no extra cost to you.
      </p>
      <article className="space-y-4 leading-relaxed">
        {blocks.map((b, i) =>
          b.type === "text" ? <p key={i} className="whitespace-pre-line">{b.text}</p> : null,
        )}
      </article>
      <p className="mt-8 text-xs text-neutral-400">
        Last updated {new Date(page.updated_at).toLocaleDateString("en-US", { dateStyle: "long" })}
      </p>
      {jsonLd.map((j, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />
      ))}
    </main>
  );
}
