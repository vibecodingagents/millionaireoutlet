import Link from "next/link";
import { getCategories } from "@/lib/content";
import { SITE_NAME } from "@/lib/seo";

function SearchForm({ id, className = "" }: { id: string; className?: string }) {
  return (
    <form action="/search" role="search" className={className}>
      <label htmlFor={id} className="sr-only">Search guides</label>
      <input
        id={id}
        name="q"
        type="search"
        placeholder="Search guides"
        className="h-11 w-full rounded-md border border-line bg-white px-3 text-sm placeholder:text-muted focus:border-gold focus:outline-none"
      />
    </form>
  );
}

export async function Header() {
  const categories = await getCategories();
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-4 py-3 sm:px-6">
        <Link href="/" className="font-serif text-2xl leading-none tracking-tight">
          {SITE_NAME}
          <span className="text-gold">.</span>
        </Link>
        <nav aria-label="Categories" className="hidden flex-1 md:block">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-1 text-sm font-medium">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/${c.slug}`} className="hover:text-gold-dark">{c.name}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <SearchForm id="search-desktop" className="ml-auto hidden w-56 md:block" />
        {/* Mobile menu: <details> needs no client JavaScript. */}
        <details className="relative ml-auto md:hidden">
          <summary className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-md border border-line" aria-label="Menu">
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="1.5" /></svg>
          </summary>
          <div className="absolute right-0 mt-2 w-72 rounded-lg border border-line bg-white p-4 shadow-lg">
            <SearchForm id="search-mobile" />
            <ul className="mt-3 space-y-1">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/${c.slug}`} className="flex min-h-11 items-center rounded px-2 hover:bg-cream">{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </div>
    </header>
  );
}
