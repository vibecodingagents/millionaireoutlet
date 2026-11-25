-- Phase 1: categories and pages with row-level security.
-- Admin = authenticated user whose app_metadata.role = 'admin'
-- (app_metadata can only be set server-side, so users cannot grant it to themselves).

create or replace function public.is_admin()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  description text,
  meta_title text check (char_length(meta_title) <= 60),
  meta_description text check (char_length(meta_description) <= 160),
  og_image text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.pages (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  slug text not null check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title text not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  blocks jsonb not null default '[]'::jsonb,
  meta_title text check (char_length(meta_title) <= 60),
  meta_description text check (char_length(meta_description) <= 160),
  canonical_url text,
  og_image text,
  noindex boolean not null default false,
  schema_json jsonb,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, slug)
);

create index pages_category_status_idx on public.pages (category_id, status);

create trigger categories_updated_at before update on public.categories
  for each row execute function public.set_updated_at();
create trigger pages_updated_at before update on public.pages
  for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.pages enable row level security;

-- Public: read categories and published pages only.
create policy "public reads categories" on public.categories
  for select using (true);
create policy "public reads published pages" on public.pages
  for select using (status = 'published');

-- Admin: full access.
create policy "admin manages categories" on public.categories
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin manages pages" on public.pages
  for all using (public.is_admin()) with check (public.is_admin());
