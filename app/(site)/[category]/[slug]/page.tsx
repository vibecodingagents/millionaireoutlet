import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlockRenderer } from "@/components/BlockRenderer";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Disclosure } from "@/components/Disclosure";
import { JsonLd } from "@/components/JsonLd";
import { PageGrid } from "@/components/PageCard";
import { hasAffiliateLinks, mediaIds, parseBlocks } from "@/lib/blocks";
import { getCategory, getPage, getRelatedPages } from "@/lib/content";
import { loadMedia } from "@/lib/media";
import { buildMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 60;

// Render on first request, then serve from cache (ISR). Publishing revalidates.
export async function generateStaticParams() {
  return [];
}

type Params = Promise<{ category: string; slug: string }>;

async function load(categorySlug: string, slug: string) {
  const category = await getCategory(categorySlug);
  if (!category) return null;
  const page = await getPage(category.id, slug);
  return page ? { category, page } : null;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category, slug } = await params;
  const data = await load(category, slug);
  if (!data) return {};
  return buildMetadata(data.page, `/${category}/${slug}`);
}

const fmt = (d: string) => new Date(d).toLocaleDateString("en-US", { dateStyle: "long", timeZone: "America/New_York" });

export default async function ContentPage({ params }: { params: Params }) {
  const { category: categorySlug, slug } = await params;
  const data = await load(categorySlug, slug);
  if (!data) notFound();
  const { category, page } = data;
  const blocks = parseBlocks(page.blocks);
  const [media, related] = await Promise.all([
    loadMedia(mediaIds(blocks)),
    getRelatedPages(category.id, slug),
  ]);
  const url = `${SITE_URL}/${categorySlug}/${slug}`;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <article className="mx-auto max-w-3xl">
        <Breadcrumbs
          items={[
            { name: category.name, href: `/${categorySlug}` },
            { name: page.title, href: `/${categorySlug}/${slug}` },
          ]}
        />
        <h1 className="mt-6 font-serif text-4xl leading-tight sm:text-5xl">{page.title}</h1>
        <p className="mt-4 text-sm text-muted">
          By the {SITE_NAME} team &middot; Last updated <time dateTime={page.updated_at}>{fmt(page.updated_at)}</time>
        </p>
        {hasAffiliateLinks(blocks) && <div className="mt-6"><Disclosure /></div>}
        <div className="mt-8">
          <BlockRenderer blocks={blocks} media={media} />
        </div>
      </article>

      {related.length > 0 && (
        <aside className="mt-20 border-t border-line pt-10">
          <h2 className="mb-6 font-serif text-3xl">More {category.name.toLowerCase()} guides</h2>
          <PageGrid pages={related} />
        </aside>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: page.title,
          description: page.meta_description ?? undefined,
          image: page.og_image ?? undefined,
          datePublished: page.published_at ?? undefined,
          dateModified: page.updated_at,
          mainEntityOfPage: url,
          inLanguage: "en-US",
          author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
          publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
        }}
      />
      {page.schema_json && <JsonLd data={page.schema_json} />}
    </div>
  );
}
