# SEO: rules for ranking in the USA

## Targeting
- Language `en-US`, prices in USD, US affiliate programs only.
- Add the site to Google Search Console; submit `sitemap.xml`.
- Host on Vercel US regions.

## Page-level rules
- **Meta title:** under 60 characters. Formula: `Primary Keyword (Year) | millionaireoutlet`.
- **Meta description:** under 160 characters. Include the keyword, a benefit, and a soft call to action.
- **URL:** `/category/keyword-slug`, lowercase, hyphens, no dates, under 5 words where possible.
- **One H1 per page** containing the primary keyword. H2/H3 follow a logical order.
- **Canonical URL** on every page. `noindex` only for thin or utility pages.
- **Images:** descriptive alt text, WebP, `next/image`, width/height set.
- **OG image** on every page (1200x630).

## Internal linking
- Every new page links to its category page and to 2-3 related pages.
- Category pages link to all their pages.
- Use descriptive anchor text, not "click here".

## Schema markup (JSON-LD)
- All pages: `BreadcrumbList`, `Organization` (site-wide).
- Articles/guides: `Article`.
- Pages with Q&A: `FAQPage`.
- Product roundups: `ItemList` with `Product` entries. Only include ratings/prices that are real and visible on the page.

## Content targets
- Prioritise buyer-intent searches: "best X under $Y", "X vs Y", "is X worth it", "X review".
- Each page answers the query fully, with original comparison, pros/cons, and a clear pick.
- Update prices and picks regularly; show "Last updated" date.
- Aim for 20-30 pages in one niche before expanding.

## Affiliate and trust
- Affiliate disclosure near the top of any page with affiliate links.
- All affiliate links: `rel="sponsored nofollow"`, served via `/go/<slug>`.
- No fake reviews, fake scarcity, or invented prices.

## Technical
- Server-rendered pages, fast mobile load, Core Web Vitals in the green.
- `robots.txt` blocks `/admin` and `/go/`.
- 301 redirect any changed slug.
- Auto-generated `sitemap.xml` includes only published, indexable pages.

## Tracking (after launch)
- Search Console: impressions, clicks, queries, indexing errors, weekly.
- Check which pages earn clicks on `/go/` links and improve those first.
