# PLAN: millionaireoutlet.com build checklist

Tick items off as they are done. Do one phase at a time. Ask before moving to the next.

## Phase 0: Setup
- [ ] Private GitHub repo `millionaireoutlet` with CLAUDE.md and docs/
- [ ] Next.js (App Router, TypeScript, Tailwind) scaffold
- [ ] Supabase project created, env vars set locally and in Vercel
- [ ] Vercel project linked to repo, preview deploys working
- [ ] Domain connected (Raghu adds the DNS records)

## Phase 1: Auth, categories, pages, SEO
- [ ] Migration: `categories`, `pages`
- [ ] Row-level security: public reads published only, admin writes
- [ ] Supabase Auth, single admin user, `/admin` protected
- [ ] Category CRUD
- [ ] Page CRUD with draft/published status and category picker
- [ ] Block editor: heading, rich text, image, deal card, link button, FAQ, CTA
- [ ] SEO fields per page and category: meta title, description, canonical, OG image, noindex, schema JSON
- [ ] Public routes: `/[category]` and `/[category]/[slug]`, server-rendered
- [ ] Revalidate on publish
- [ ] `sitemap.xml` and `robots.txt` from DB
- [ ] Homepage
- [ ] Typecheck, lint, build pass; deploy preview

## Phase 2: Link manager
- [ ] Migration: `links`, `link_clicks`
- [ ] Admin UI to add/edit links (label, slug, destination)
- [ ] `/go/[slug]` logs click and 302-redirects
- [ ] Link picker inside the block editor
- [ ] Click stats table in admin
- [ ] Outbound links get `rel="sponsored nofollow"` automatically

## Phase 3: Media library
- [ ] Migration: `media`; Supabase Storage bucket
- [ ] Upload, alt text required, auto-convert to WebP
- [ ] Image picker inside the block editor

## Phase 4: AI helpers
- [ ] Generate meta title/description from page content
- [ ] Generate deal descriptions
- [ ] Higgsfield promo video/banner generator (server-side key only)
- [ ] Review-before-save for all AI output

## Launch checklist
- [ ] Google Search Console verified, sitemap submitted
- [ ] Affiliate disclosure page and footer link
- [ ] Privacy policy and contact page
- [ ] Core Web Vitals checked on mobile
- [ ] 20+ published pages in the first niche
