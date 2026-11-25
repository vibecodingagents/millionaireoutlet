import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PageGrid } from "@/components/PageCard";
import { RichText } from "@/components/RichText";
import { getCategory, getCategoryPages } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const revalidate = 60;

// Render on first request, then serve from cache (ISR). Publishing revalidates.
export async function generateStaticParams() {
  return [];
}

type Params = Promise<{ category: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category: slug } = await params;
  const category = await getCategory(slug);
  if (!category) return {};
  return buildMetadata({ title: category.name, ...category }, `/${slug}`, "website");
}

export default async function CategoryPage({ params }: { params: Params }) {
  const { category: slug } = await params;
  const category = await getCategory(slug);
  if (!category) notFound();
  const pages = await getCategoryPages(category.id);
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <Breadcrumbs items={[{ name: category.name, href: `/${slug}` }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="font-serif text-4xl leading-tight sm:text-5xl">{category.name}</h1>
        {category.description && (
          <div className="mt-4 text-lg text-muted">
            <RichText text={category.description} />
          </div>
        )}
      </header>
      <div className="mt-10">
        {pages.length ? <PageGrid pages={pages} /> : <p className="text-muted">New guides are coming soon.</p>}
      </div>
    </div>
  );
}
