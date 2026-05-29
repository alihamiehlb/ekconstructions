-- Enquiry CRM fields, admin users, business (invoices/orders/clients)

alter table public.enquiries
  add column if not exists status text not null default 'new'
    check (status in ('new', 'contacted', 'quoted', 'won', 'lost')),
  add column if not exists notes text check (notes is null or char_length(notes) <= 8000),
  add column if not exists read_at timestamptz;

create index if not exists enquiries_status_idx on public.enquiries (status);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  email text not null unique check (char_length(email) between 3 and 320),
  name text not null check (char_length(name) between 1 and 120),
  password_hash text not null check (char_length(password_hash) between 20 and 500),
  role text not null default 'admin' check (role in ('admin', 'editor', 'viewer')),
  active boolean not null default true,
  last_login timestamptz
);

create table if not exists public.business_clients (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 200),
  email text check (email is null or char_length(email) <= 320),
  phone text check (phone is null or char_length(phone) <= 40),
  company text check (company is null or char_length(company) <= 200),
  notes text check (notes is null or char_length(notes) <= 4000)
);

create table if not exists public.business_orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  client_id uuid references public.business_clients (id) on delete set null,
  enquiry_id uuid references public.enquiries (id) on delete set null,
  title text not null check (char_length(title) between 1 and 300),
  status text not null default 'draft'
    check (status in ('draft', 'quoted', 'accepted', 'in_progress', 'completed', 'cancelled')),
  description text check (description is null or char_length(description) <= 8000),
  revenue_cents bigint not null default 0 check (revenue_cents >= 0),
  cost_cents bigint not null default 0 check (cost_cents >= 0)
);

create table if not exists public.business_invoices (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  order_id uuid references public.business_orders (id) on delete set null,
  client_id uuid references public.business_clients (id) on delete set null,
  invoice_number text not null unique check (char_length(invoice_number) between 1 and 40),
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  amount_cents bigint not null default 0 check (amount_cents >= 0),
  gst_cents bigint not null default 0 check (gst_cents >= 0),
  total_cents bigint not null default 0 check (total_cents >= 0),
  due_date date,
  notes text check (notes is null or char_length(notes) <= 4000)
);

create index if not exists business_orders_status_idx on public.business_orders (status);
create index if not exists business_invoices_status_idx on public.business_invoices (status);

alter table public.admin_users enable row level security;
alter table public.business_clients enable row level security;
alter table public.business_orders enable row level security;
alter table public.business_invoices enable row level security;

revoke all on table public.admin_users from anon, authenticated, public;
revoke all on table public.business_clients from anon, authenticated, public;
revoke all on table public.business_orders from anon, authenticated, public;
revoke all on table public.business_invoices from anon, authenticated, public;

grant all on table public.admin_users to service_role;
grant all on table public.business_clients to service_role;
grant all on table public.business_orders to service_role;
grant all on table public.business_invoices to service_role;

drop policy if exists "deny_all_admin_users" on public.admin_users;
create policy "deny_all_admin_users" on public.admin_users
  for all to anon, authenticated using (false) with check (false);

drop policy if exists "deny_all_business_clients" on public.business_clients;
create policy "deny_all_business_clients" on public.business_clients
  for all to anon, authenticated using (false) with check (false);

drop policy if exists "deny_all_business_orders" on public.business_orders;
create policy "deny_all_business_orders" on public.business_orders
  for all to anon, authenticated using (false) with check (false);

drop policy if exists "deny_all_business_invoices" on public.business_invoices;
create policy "deny_all_business_invoices" on public.business_invoices
  for all to anon, authenticated using (false) with check (false);
