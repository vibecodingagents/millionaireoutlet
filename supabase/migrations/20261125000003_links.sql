-- Phase 2: affiliate link manager and click tracking.
-- Links are private (admin only). The public /go/<slug> route calls track_click(),
-- which logs the click and returns the destination without exposing the table.

create table public.links (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  destination_url text not null check (destination_url ~* '^https?://'),
  label text not null,
  clicks integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.link_clicks (
  id bigint generated always as identity primary key,
  link_id uuid not null references public.links(id) on delete cascade,
  created_at timestamptz not null default now(),
  referrer text
);

create index link_clicks_link_created_idx on public.link_clicks (link_id, created_at desc);

create trigger links_updated_at before update on public.links
  for each row execute function public.set_updated_at();

alter table public.links enable row level security;
alter table public.link_clicks enable row level security;

create policy "admin manages links" on public.links
  for all using (public.is_admin()) with check (public.is_admin());
create policy "admin reads clicks" on public.link_clicks
  for select using (public.is_admin());
create policy "admin deletes clicks" on public.link_clicks
  for delete using (public.is_admin());

-- Logs one click and returns the destination URL (null if the slug is unknown).
create or replace function public.track_click(p_slug text, p_referrer text default null)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_dest text;
begin
  update public.links set clicks = clicks + 1
    where slug = p_slug
    returning id, destination_url into v_id, v_dest;
  if v_id is null then
    return null;
  end if;
  insert into public.link_clicks (link_id, referrer) values (v_id, left(p_referrer, 500));
  return v_dest;
end;
$$;

revoke execute on function public.track_click(text, text) from public;
grant execute on function public.track_click(text, text) to anon, authenticated;

-- Looks up a destination without counting a click (used for bot traffic).
create or replace function public.link_destination(p_slug text)
returns text
language sql
stable
security definer
set search_path = ''
as $$
  select destination_url from public.links where slug = p_slug;
$$;

revoke execute on function public.link_destination(text) from public;
grant execute on function public.link_destination(text) to anon, authenticated;
