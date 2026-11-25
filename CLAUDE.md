# millionaireoutlet.com

Custom CMS + public site for a US-targeted "luxury for less" deal/outlet site. Revenue: affiliate commissions. Owner: Raghu (solo builder).

## Stack
- Next.js (App Router, TypeScript), server-rendered public pages
- Supabase: Postgres, Auth, Storage (one project)
- Vercel hosting (US region), GitHub repo `millionaireoutlet`
- Tailwind CSS. Keep dependencies minimal.

## Structure
- `app/(site)/` public pages, rendered from DB, cached, revalidated on publish
- `app/(site)/[category]/[slug]/` page inside a category
- `app/(site)/[category]/` category landing page, auto-lists its pages
- `app/admin/` protected CMS (single admin user)
- `app/go/[slug]/` affiliate redirect: log click, 302 to destination
- `app/sitemap.ts`, `app/robots.ts` generated from DB
- `components/` shared blocks and layout (Header, Footer, DealCard, etc.)
- `lib/` supabase clients, seo helpers, block renderers
- `supabase/migrations/` all schema changes live here, never edit via dashboard only
- `docs/` project docs (PLAN.md, SEO.md, DESIGN.md, CONTENT-GUIDE.md, DECISIONS.md). Read the relevant one before related work.

## Data model
- `categories`: id, name, slug, description, meta_title, meta_description, og_image
- `pages`: id, category_id, slug, title, status (draft/published), blocks (jsonb), meta_title, meta_description, canonical_url, og_image, noindex, schema_json, timestamps
- `links`: id, slug, destination_url, label, clicks
- `link_clicks`: link_id, created_at, referrer
- `media`: id, path, alt_text
- Row-level security on every table: public reads published content only; writes require the admin user.

## Change rules (important)
- Make the smallest change that works.
- Change shared components, not individual pages. One edit should update every page that uses it.
- Never edit more files than I name without asking. Show a diff first for anything shared.
- New pages go in a category, as drafts, using the standard template. Never copy a template into code per page.
- Ask before adding a dependency, changing the schema, or deploying to production.

## SEO and content rules
- Every page needs a unique meta title (<60 chars), meta description (<160 chars), canonical URL, and OG image.
- URLs look like `/watches/best-dive-watches-under-300`.
- All outbound affiliate links use `rel="sponsored nofollow"` and go through `/go/<slug>`.
- Include an affiliate disclosure on pages with affiliate links (FTC).
- Every image needs alt text; convert to WebP; use `next/image`.
- Target US: `en-US`, USD prices, US affiliate programs only.
- Never show AI-generated images as real products; use merchant images for product cards.
- Public pages must be server-rendered and pass Core Web Vitals.

## Secrets
- Keys (Supabase service role, Higgsfield, etc.) only in Vercel and `.env.local`. Never commit them, never expose them to the browser. `.env*` is in `.gitignore`.

## Phases
1. Auth, categories, pages CRUD, SEO fields, sitemap/robots
2. Link manager + click stats
3. Media library
4. AI helpers (SEO copy, deal descriptions, Higgsfield promo video)

## Working style
- Direct, short answers. Bottom line first.
- Run typecheck, lint and a build before saying anything is done.
