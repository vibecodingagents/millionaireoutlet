import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">404</p>
      <h1 className="mt-4 font-serif text-4xl">This page has moved or sold out.</h1>
      <p className="mt-4 text-muted">Try the homepage or search for what you need.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/" className="inline-flex min-h-11 items-center rounded-md bg-ink px-6 text-sm font-semibold text-white hover:bg-gold">Homepage</Link>
        <Link href="/search" className="inline-flex min-h-11 items-center rounded-md border border-ink px-6 text-sm font-semibold">Search</Link>
      </div>
    </main>
  );
}
