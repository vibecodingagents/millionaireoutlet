# PLAN: millionaireoutlet.com build checklist

Tick items off as they are done. Do one phase at a time. Ask before moving to the next.

## Phase 0: Setup
- [ ] Private GitHub repo `millionaireoutlet` with CLAUDE.md and docs/
- [x] Next.js (App Router, TypeScript, Tailwind) scaffold
- [ ] Supabase project created, env vars set locally and in Vercel
- [ ] Vercel project linked to repo, preview deploys working
- [ ] Domain connected (Raghu adds the DNS records)

## Phase 1: Auth, categories, pages, SEO
- [x] Migration: `categories`, `pages`
- [x] Row-level security: public reads published only, admin writes
- [x] Supabase Auth, single admin user, `/admin` protected
- [x] Category CRUD
- [x] Page CRUD with draft/published status and category picker
- [x] Block editor: heading, rich text, image, deal card, link button, FAQ, CTA
- [x] SEO fields per page and category: meta title, description, canonical, OG image, noindex, schema JSON
- [x] Public routes: `/[category]` and `/[category]/[slug]`, server-rendered
- [x] Revalidate on publish
- [x] `sitemap.xml` and `robots.txt` from DB
- [x] Homepage
- [ ] Typecheck, lint, build pass; deploy preview

## Phase 2: Link manager
- [x] Migration: `links`, `link_clicks`
- [x] Admin UI to add/edit links (label, slug, destination)
- [x] `/go/[slug]` logs click and 302-redirects
- [x] Link picker inside the block editor
- [x] Click stats table in admin
- [x] Outbound links get `rel="sponsored nofollow"` automatically

## Phase 3: Media library
- [x] Migration: `media`; Supabase Storage bucket
- [x] Upload, alt text required, auto-convert to WebP
- [x] Image picker inside the block editor

## Phase 4: AI helpers
- [ ] Generate meta title/description from page content
- [ ] Generate deal descriptions
- [ ] Higgsfield promo video/banner generator (server-side key only)
- [ ] Review-before-save for all AI output

## Launch checklist
- [ ] Google Search Console verified, sitemap submitted
- [x] Affiliate disclosure page and footer link
- [x] Privacy policy and contact page
- [ ] Core Web Vitals checked on mobile
- [ ] 20+ published pages in the first niche
