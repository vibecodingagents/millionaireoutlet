import Link from "next/link";
import { getCategories } from "@/lib/content";
import { SITE_NAME } from "@/lib/seo";
import { FOOTER_LINKS } from "@/lib/site";

export async function Footer() {
  const categories = await getCategories();
  return (
    <footer className="mt-24 border-t border-line bg-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-serif text-xl">{SITE_NAME}<span className="text-gold">.</span></p>
          <p className="mt-2 max-w-xs text-sm text-muted">Luxury for less. Curated deals and honest buying guides for US shoppers.</p>
        </div>
        {categories.length > 0 ? (
        <nav aria-label="Footer categories">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Categories</h2>
          <ul className="space-y-2 text-sm">
            {categories.map((c) => (
              <li key={c.slug}><Link href={`/${c.slug}`} className="hover:underline">{c.name}</Link></li>
            ))}
          </ul>
        </nav>
        ) : <div />}
        <nav aria-label="Company">
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">Company</h2>
          <ul className="space-y-2 text-sm">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}><Link href={l.href} className="hover:underline">{l.label}</Link></li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-6 text-xs text-muted sm:px-6">
          As an affiliate, we may earn a commission from qualifying purchases made through links on this site, at no extra
          cost to you. Prices and availability are accurate as of the date shown on each page and may change.
          &copy; {new Date().getFullYear()} {SITE_NAME}.
        </p>
      </div>
    </footer>
  );
}
