-- Instagram feed + security audit persistence (service_role only)

create table if not exists public.instagram_feed (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.instagram_feed enable row level security;
revoke all on table public.instagram_feed from anon, authenticated, public;
grant all on table public.instagram_feed to service_role;

drop policy if exists "deny_all_instagram_feed" on public.instagram_feed;
create policy "deny_all_instagram_feed" on public.instagram_feed
  for all to anon, authenticated
  using (false)
  with check (false);

create table if not exists public.security_audit (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  type text not null check (char_length(type) <= 64),
  ip text check (ip is null or char_length(ip) <= 64),
  detail text check (detail is null or char_length(detail) <= 500)
);

create index if not exists security_audit_created_at_idx on public.security_audit (created_at desc);

alter table public.security_audit enable row level security;
revoke all on table public.security_audit from anon, authenticated, public;
grant insert, select on table public.security_audit to service_role;

drop policy if exists "deny_all_security_audit" on public.security_audit;
create policy "deny_all_security_audit" on public.security_audit
  for all to anon, authenticated
  using (false)
  with check (false);

-- Storage: public read for media bucket, writes via service role only
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do update set public = true;

drop policy if exists "media_public_read" on storage.objects;
create policy "media_public_read" on storage.objects
  for select to public
  using (bucket_id = 'media');

drop policy if exists "media_service_write" on storage.objects;
create policy "media_service_write" on storage.objects
  for all to service_role
  using (bucket_id = 'media')
  with check (bucket_id = 'media');
