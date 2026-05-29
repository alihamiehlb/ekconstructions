-- EK Constructions — secure Supabase schema with RLS
-- Run via Supabase Dashboard → SQL, or: supabase db push

create extension if not exists "pgcrypto";

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 200),
  email text not null check (char_length(email) between 3 and 320),
  phone text check (phone is null or char_length(phone) <= 40),
  service text check (service is null or char_length(service) <= 120),
  message text not null check (char_length(message) between 1 and 8000),
  source_ip text check (source_ip is null or char_length(source_ip) <= 64)
);

create table if not exists public.page_views (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  path text not null check (char_length(path) between 1 and 500),
  referrer text check (referrer is null or char_length(referrer) <= 2000)
);

create table if not exists public.cms_content (
  id text primary key default 'main',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists page_views_created_at_idx on public.page_views (created_at desc);
create index if not exists page_views_path_idx on public.page_views (path);

alter table public.enquiries enable row level security;
alter table public.page_views enable row level security;
alter table public.cms_content enable row level security;

-- Block browser / anon API access; server uses service_role only
revoke all on table public.enquiries from anon, authenticated, public;
revoke all on table public.page_views from anon, authenticated, public;
revoke all on table public.cms_content from anon, authenticated, public;

grant all on table public.enquiries to service_role;
grant all on table public.page_views to service_role;
grant all on table public.cms_content to service_role;

-- Explicit deny policies (defense in depth if grants change)
drop policy if exists "deny_all_enquiries" on public.enquiries;
create policy "deny_all_enquiries" on public.enquiries
  for all to anon, authenticated
  using (false)
  with check (false);

drop policy if exists "deny_all_page_views" on public.page_views;
create policy "deny_all_page_views" on public.page_views
  for all to anon, authenticated
  using (false)
  with check (false);

drop policy if exists "deny_all_cms" on public.cms_content;
create policy "deny_all_cms" on public.cms_content
  for all to anon, authenticated
  using (false)
  with check (false);
