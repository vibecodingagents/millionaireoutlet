# millionaireoutlet.com

A US-targeted "luxury for less" deal site with a custom CMS. Built with Next.js, Supabase and Vercel.

## What it does
- Public pages organised by category, server-rendered for SEO
- `/admin` backend: pages, categories, SEO fields, links, images
- `/go/<slug>` affiliate redirects with click tracking
- Auto-generated `sitemap.xml` and `robots.txt`

## Run locally
```bash
git clone <your-repo-url>
cd millionaireoutlet
npm install
cp .env.example .env.local   # fill in values (see below)
npm run dev                  # http://localhost:3000
```

## Environment variables
Put these in `.env.local` locally and in Vercel project settings. Never commit them.

| Name | Where it's used |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | browser and server |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | browser and server |
| `SUPABASE_SERVICE_ROLE_KEY` | server only |
| `NEXT_PUBLIC_SITE_URL` | sitemap, canonical URLs |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Contact and Privacy pages |
| `HIGGSFIELD_API_KEY` | server only (phase 4) |

## Database
Schema lives in `supabase/migrations/`. Apply with the Supabase CLI. Don't change tables only in the dashboard.

```bash
supabase link --project-ref <project-ref>
supabase db push
```

Optional starter content (Watches category + one draft page skeleton): run `supabase/seed.sql` in the SQL editor.

## Admin user
Create the user in Supabase Auth, then give it the admin role (SQL editor):

```sql
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'
where email = 'you@example.com';
```

Sign out and back in at `/admin/login` so the new role is in the session.

## Content editing
- **Pages:** built from blocks (heading, text, image, deal card, link button, FAQ, CTA, comparison table). Text blocks support `**bold**`, `[links](/watches/page)` and `- ` lists.
- **Links:** add affiliate links under Admin → Links, then pick them in deal cards, buttons and CTAs. They're served at `/go/<slug>` with `rel="sponsored nofollow"`, and the disclosure appears automatically.
- **Media:** upload under Admin → Media. Alt text is required; images are converted to WebP.

## Deploy
Push to `main` and Vercel deploys. Pull requests get preview URLs. Run `npm run build` first to catch errors.

## Docs
See `docs/`: `PLAN.md` (build checklist), `SEO.md`, `DESIGN.md`, `CONTENT-GUIDE.md`, `DECISIONS.md`. Project rules for Claude are in `CLAUDE.md`.
