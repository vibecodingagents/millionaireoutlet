-- Phase 3: media library. Files live in the public "media" Storage bucket as WebP.
-- Alt text is required. Width/height are stored so next/image can reserve space (no layout shift).

create table public.media (
  id uuid primary key default gen_random_uuid(),
  path text not null unique,
  alt_text text not null check (char_length(btrim(alt_text)) > 0),
  width integer not null check (width > 0),
  height integer not null check (height > 0),
  created_at timestamptz not null default now()
);

alter table public.media enable row level security;

create policy "public reads media" on public.media
  for select using (true);
create policy "admin manages media" on public.media
  for all using (public.is_admin()) with check (public.is_admin());

-- Public bucket: anyone can read files by URL; only the admin can write. WebP only, 5 MB max.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('media', 'media', true, 5242880, array['image/webp'])
on conflict (id) do nothing;

create policy "admin uploads media" on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and public.is_admin());
create policy "admin updates media" on storage.objects
  for update to authenticated using (bucket_id = 'media' and public.is_admin());
create policy "admin deletes media" on storage.objects
  for delete to authenticated using (bucket_id = 'media' and public.is_admin());
-- Storage's remove() needs select as well as delete.
create policy "admin reads media objects" on storage.objects
  for select to authenticated using (bucket_id = 'media' and public.is_admin());
