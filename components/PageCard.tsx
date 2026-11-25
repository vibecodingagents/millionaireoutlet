import Image from "next/image";
import Link from "next/link";
import type { PageCardRow } from "@/lib/content";
import { isOptimizable } from "@/lib/media";

// Card used on the homepage, category pages, related pages and search results.
export function PageCard({ page, showCategory = false }: { page: PageCardRow; showCategory?: boolean }) {
  const href = `/${page.categories?.slug}/${page.slug}`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-lg border border-line bg-white transition-shadow hover:shadow-md">
      <Link href={href} className="flex flex-1 flex-col">
        <div className="relative aspect-[1200/630] bg-cream">
          {isOptimizable(page.og_image) ? (
            <Image
              src={page.og_image}
              alt=""
              fill
              sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-serif text-2xl text-gold">
              {page.categories?.name}
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-5">
          {showCategory && page.categories && (
            <span className="text-xs font-semibold uppercase tracking-wider text-gold-dark">{page.categories.name}</span>
          )}
          <h3 className="font-serif text-xl leading-snug group-hover:underline">{page.title}</h3>
          {page.meta_description && <p className="line-clamp-2 text-sm text-muted">{page.meta_description}</p>}
        </div>
      </Link>
    </article>
  );
}

export function PageGrid({ pages, showCategory }: { pages: PageCardRow[]; showCategory?: boolean }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {pages.map((p) => (
        <PageCard key={`${p.categories?.slug}/${p.slug}`} page={p} showCategory={showCategory} />
      ))}
    </div>
  );
}
