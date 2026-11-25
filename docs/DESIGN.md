# DESIGN: look and feel

Status: proposed defaults. Raghu can change any of these. Update this file when the brand is decided.

## Brand feel
Premium but approachable: "luxury for less". Clean, lots of white space, confident typography. It should feel like a curated boutique, not a coupon site.

## Colors (proposed)
- Background: white `#FFFFFF`, soft section background `#F7F5F0`
- Text: near-black `#111111`, muted `#666666`
- Accent (gold): `#B8924A`
- Deal/CTA button: dark `#111111` with white text; hover gold
- Success/deal-saving tag: green `#1E7B4F`

## Typography (proposed)
- Headings: a serif such as Playfair Display
- Body: a clean sans such as Inter
- Body size 16-18px, line height 1.6, max text width about 700px

## Layout
- Header: logo, category menu, search. Footer: categories, About, Contact, Affiliate Disclosure, Privacy.
- Category page: title, short intro, grid of page cards (image, title, one-line summary).
- Article page: H1, disclosure line, intro, picks list, comparison table, FAQ, CTA.
- Mobile first. Tap targets at least 44px.

## Components
- `DealCard`: image, title, price, short pitch, "View deal" button (via `/go/<slug>`), disclosure icon.
- `ComparisonTable`: responsive, scrolls horizontally on mobile.
- `FAQ`: accordion, outputs FAQ schema.
- `CTA`: single clear button block.
- Build once in `components/`, reuse everywhere.

## Images
- Photos for articles from Unsplash or the merchant; generated art only for banners and backgrounds.
- Hero images 1600px wide, WebP, with alt text.
- Never present AI-generated images as the actual product for sale.

## Accessibility
- Color contrast AA minimum.
- Visible focus states.
- Alt text on every image; semantic headings.
