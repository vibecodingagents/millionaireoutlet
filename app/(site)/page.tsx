import Link from "next/link";
import { PageGrid } from "@/components/PageCard";
import { getCategories, getLatestPages } from "@/lib/content";

export const revalidate = 60;

export default async function Home() {
  const [categories, latest] = await Promise.all([getCategories(), getLatestPages(6)]);
  return (
    <>
      <section className="border-b border-line bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Luxury for less</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight sm:text-6xl">
            The good stuff, at a price that makes sense.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted">
            Honest buying guides and hand-picked deals on luxury goods for US shoppers. We compare, we pick, and we tell
            you who each pick is not for.
          </p>
          {categories[0] && (
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/${categories[0].slug}`}
                className="inline-flex min-h-11 items-center rounded-md bg-ink px-6 text-sm font-semibold text-white hover:bg-gold"
              >
                Browse {categories[0].name.toLowerCase()}
              </Link>
              <Link href="/about" className="inline-flex min-h-11 items-center rounded-md border border-ink px-6 text-sm font-semibold hover:bg-white">
                How we pick
              </Link>
            </div>
          )}
        </div>
      </section>

      {categories.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="font-serif text-3xl">Shop by category</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="group rounded-lg border border-line p-6 transition-colors hover:border-gold hover:bg-cream"
              >
                <h3 className="font-serif text-2xl group-hover:text-gold-dark">{c.name}</h3>
                {c.description && <p className="mt-2 line-clamp-3 text-sm text-muted">{c.description}</p>}
                <span className="mt-4 inline-block text-sm font-semibold">Explore &rarr;</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {latest.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
          <h2 className="mb-6 font-serif text-3xl">Latest guides</h2>
          <PageGrid pages={latest} showCategory />
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 rounded-lg border border-line p-8 sm:grid-cols-3">
          {[
            ["Real prices only", "Every price is checked and dated. No invented discounts, no fake countdowns."],
            ["A clear pick", "We compare the options and tell you which one to buy, and who should skip it."],
            ["US retailers", "Prices in USD from US stores and authorized dealers."],
          ].map(([title, text]) => (
            <div key={title}>
              <h3 className="font-serif text-xl">{title}</h3>
              <p className="mt-2 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
