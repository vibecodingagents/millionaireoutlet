# DECISIONS: log of choices (newest last)

Format: date, decision, reason. Don't revisit a decision without a new reason.

- **2026-11-25: Build a custom CMS (not WordPress or a headless CMS).** Owner builds software products, wants full control, no CMS fees, and room for AI features. Decided by Raghu.
- **2026-11-25: Stack is Next.js + Supabase + Vercel.** Fits the owner's existing tools. Claude's recommendation.
- **2026-11-25: Page content stored as JSON blocks.** Easy to edit, reorder, and render server-side. Claude's recommendation.
- **2026-11-25: Single admin user.** Solo owner; avoids role complexity. Claude's recommendation.
- **2026-11-25: Pages live inside categories (`/category/slug`).** Better structure and SEO, easy bulk adds. Added at Raghu's request.
- **2026-11-25: Affiliate links go through `/go/<slug>`.** Click tracking and one place to change a destination. Claude's recommendation.
- **2026-11-25: Target market is the USA.** US language, USD, US affiliate programs. Decided by Raghu.
- **2026-11-25: AI-generated images are for banners/backgrounds only, never as real product photos.** Avoids misleading buyers and affiliate/FTC issues. Claude's recommendation.
- **2026-11-25: Higgsfield API is a phase 4 helper.** Marketing video/banners, not core to ranking. Claude's recommendation.

- **2026-11-25: First niche is Watches.** Matches the URL examples in the docs; starter category and a draft page skeleton are in `supabase/seed.sql`. Decided by Raghu.
- **2026-11-25: Use the DESIGN.md defaults for brand.** White/cream, gold `#B8924A`, Playfair Display + Inter via `next/font` (self-hosted, no npm package). Decided by Raghu.
- **2026-11-25: `/go/` clicks are logged through a `track_click()` database function.** The public route needs no service-role key and the `links` table stays private. Known bots and link previews are redirected but not counted. Claude's recommendation.
- **2026-11-25: Images are converted to WebP in the browser before upload.** No image-processing dependency on the server; max 1600px wide. `media` also stores width/height so `next/image` reserves space (no layout shift). Claude's recommendation.
- **2026-11-25: All images come from the media library.** `next/image` only optimizes the Supabase Storage host, so merchant photos are uploaded rather than hot-linked. Claude's recommendation.

## Open
- Contact email address (defaults to hello@millionaireoutlet.com; set `NEXT_PUBLIC_CONTACT_EMAIL`)
- Privacy policy needs a review before launch (CCPA/CPRA)
- 301 redirects for changed slugs (not built yet)
