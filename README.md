# EK Constructions — Website + Admin Dashboard

## Project structure

```
ekconsturct/
├── app/                 # Pages & API routes
│   ├── admin/           # Admin dashboard
│   ├── api/             # Contact, analytics, admin auth
│   └── page.tsx         # Public homepage
├── components/          # UI sections, 3D hero, admin charts
├── content/             # Site copy & project gallery config
├── lib/                 # Auth, validation, data store
├── public/              # Static assets (add your photos here)
├── supabase/schema.sql  # Production database setup
└── data/                # Local leads DB (created automatically in dev)
```

## Quick start

```powershell
cd ekconsturct
npm install
# Create .env.local locally (never commit) — see Deploy section for variable names
npm run dev
```

- **Website:** http://localhost:3000  
- **Admin:** http://localhost:3000/admin  

Default admin login uses `ADMIN_PASSWORD` from `.env.local`.

## Admin dashboard

Tracks:

- Total enquiries & weekly/monthly counts  
- Page views (last 7 days chart)  
- Conversion rate (enquiries ÷ views)  
- Enquiries by service (bar chart)  
- Recent leads table with contact details  

### Storage modes

| Mode | When | Notes |
|------|------|--------|
| **file** | No Supabase env vars | Saves to `data/store.json` — works locally only |
| **supabase** | `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` | Required for Vercel production |

### Supabase setup (production)

1. Create a project at [supabase.com](https://supabase.com).  
2. Run `supabase/schema.sql` (or `supabase/migrations/20240529000000_secure_rls.sql`) in **SQL Editor** — enables RLS and blocks public table access.  
3. In **Project Settings → API**, copy the Project URL and **service_role** key (server-only).  

## Deploy (Vercel)

1. Import the GitHub repo on [vercel.com](https://vercel.com).  
2. Add environment variables in **Project → Settings → Environment Variables** (see list below).  
3. Redeploy after adding variables.

**Required env vars (Vercel + local `.env.local`):**

| Variable | Where to get it |
|----------|-----------------|
| `NEXT_PUBLIC_SITE_URL` | Your Vercel URL or custom domain (e.g. `https://ekconstructions.com.au`) |
| `ADMIN_SECRET` | Generate a random 32+ character string (e.g. `openssl rand -hex 32`) |
| `ADMIN_PASSWORD` | Choose a strong admin dashboard password |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` (secret) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Your business email |
| `NEXT_PUBLIC_CONTACT_PHONE` | Optional phone number |
| `NEXT_PUBLIC_INSTAGRAM_VIDEO_URL` | Full Instagram reel/post URL for hero video |

## Instagram gallery

1. Open **Admin → Instagram** (`/admin/instagram`).
2. Click **Discover & sync profile** or paste post URLs from [@ekconstructions](https://www.instagram.com/ekconstructions/).
3. Images use **direct Instagram CDN links** (not downloaded). Carousel posts stay grouped as one gallery project with slides.

Optional: set `INSTAGRAM_SESSION_ID` in Vercel env (from browser cookies while logged into Instagram) so “Discover” can load all profile posts.

Feed is stored in **Supabase** (`instagram_feed` table) and `content/instagram-feed.json` for git backup.

## Security (DB → Vercel)

- Supabase tables `enquiries`, `page_views`, `cms_content`, `instagram_feed`, `security_audit` — RLS enabled, **deny all** for `anon` / `authenticated`; only `service_role` on the server.
- Run migrations in `supabase/migrations/` in the Supabase SQL editor (including `20240529120000_instagram_feed_and_storage.sql`).
- Admin: JWT session cookie, CSRF on mutations, origin allowlist (includes your Vercel URL), rate limits, input sanitization.
- Contact form saves to DB only (no Resend). Enquiries visible in **Admin → Dashboard**.

Contact form enquiries are saved in the admin dashboard (no third-party email API required).

## Tech stack

Next.js 15 · Tailwind · Framer Motion · React Three Fiber · Recharts · Supabase (optional) · Vercel
