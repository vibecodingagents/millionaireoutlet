import type { Metadata } from "next";
import { PageGrid } from "@/components/PageCard";
import { searchPages } from "@/lib/content";

export const metadata: Metadata = { title: "Search", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = query ? await searchPages(query) : [];
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <h1 className="font-serif text-4xl">Search</h1>
      <form action="/search" role="search" className="mt-6 flex max-w-xl gap-2">
        <label htmlFor="q" className="sr-only">Search guides</label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="e.g. dive watch"
          className="h-11 flex-1 rounded-md border border-line px-3 focus:border-gold focus:outline-none"
        />
        <button className="min-h-11 rounded-md bg-ink px-5 text-sm font-semibold text-white hover:bg-gold">Search</button>
      </form>
      <div className="mt-10">
        {query && (
          <p className="mb-6 text-muted">
            {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
          </p>
        )}
        {results.length > 0 && <PageGrid pages={results} showCategory />}
      </div>
    </div>
  );
}
