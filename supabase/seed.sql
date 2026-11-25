-- Starter content for the first niche (Watches). Optional: run once in the SQL editor
-- or with `supabase db reset` locally. Creates one category and one DRAFT page skeleton.
-- The page uses [placeholders]; fill in real, checked products and prices before publishing.

insert into public.categories (name, slug, description, meta_title, meta_description)
values (
  'Watches',
  'watches',
  'Great watches don''t have to cost a month''s rent. We compare dive watches, dress watches and everyday automatics from US retailers and authorized dealers, and give you one clear pick for each budget. Every guide shows the date we last checked prices, and tells you who each watch is **not** for.',
  'Luxury Watches for Less: Honest Buying Guides',
  'Dive, dress and everyday watches at sensible prices. Clear picks, real dated prices, and honest notes on who should skip each one.'
)
on conflict (slug) do nothing;

insert into public.pages (category_id, slug, title, status, meta_title, meta_description, blocks)
select
  c.id,
  'best-dive-watches-under-300',
  'Best Dive Watches Under $300',
  'draft',
  'Best Dive Watches Under $300 (2026) | millionaireoutlet',
  'The best dive watches under $300, compared: our top pick, a budget choice and a step-up option, with real prices and who should skip each.',
  $json$[
    {"type": "text", "text": "[Two sentences that answer the query: which watch we'd buy under $300 and why.]"},
    {"type": "heading", "level": 2, "text": "Quick picks"},
    {"type": "table", "headers": ["Pick", "Watch", "Why"], "rows": [
      ["Best overall", "[Watch]", "[One line]"],
      ["Best budget", "[Watch]", "[One line]"],
      ["Best step-up", "[Watch]", "[One line]"]
    ]},
    {"type": "heading", "level": 2, "text": "Best overall: [Watch]"},
    {"type": "deal", "title": "[Watch]", "badge": "Best overall", "pitch": "[Who it's for, and who should skip it.]", "pros": ["[Pro]"], "cons": ["[Con]"]},
    {"type": "heading", "level": 2, "text": "Best budget: [Watch]"},
    {"type": "deal", "title": "[Watch]", "badge": "Best budget", "pitch": "[Who it's for, and who should skip it.]", "pros": ["[Pro]"], "cons": ["[Con]"]},
    {"type": "heading", "level": 2, "text": "Best step-up: [Watch]"},
    {"type": "deal", "title": "[Watch]", "badge": "Best step-up", "pitch": "[Who it's for, and who should skip it.]", "pros": ["[Pro]"], "cons": ["[Con]"]},
    {"type": "heading", "level": 2, "text": "How we chose"},
    {"type": "text", "text": "[What we compared and how.]"},
    {"type": "heading", "level": 2, "text": "What to look for in a dive watch"},
    {"type": "text", "text": "- **Water resistance:** [note]\n- **Bezel:** [note]\n- **Crown:** [note]\n- **Movement:** [note]\n- **Lume:** [note]"},
    {"type": "heading", "level": 2, "text": "FAQ"},
    {"type": "faq", "items": [
      {"q": "[Real question people search]", "a": "[Answer]"},
      {"q": "[Real question people search]", "a": "[Answer]"},
      {"q": "[Real question people search]", "a": "[Answer]"}
    ]}
  ]$json$::jsonb
from public.categories c
where c.slug = 'watches'
on conflict (category_id, slug) do nothing;
