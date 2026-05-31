# Implementation Plan: Gallery Categories, Admin Simplification, Link-Based Images, Hero Upgrade, Replace Before/After

## Task Type
- [x] Frontend (→ Gemini perspective: hero, gallery UX, new homepage section)
- [x] Backend (→ Codex perspective: CMS data model, API cleanup, Instagram removal)
- [x] Fullstack (→ Parallel execution recommended)

## Executive Summary

The site currently treats **Instagram sync** as the gallery source of truth (`lib/projects.ts` → `readInstagramFeed()`), while category metadata lives in a **manual JSON file** (`content/instagram-post-meta.json`) with no admin UI. Gallery filters only appear when `categories.length > 1` (`GalleryGrid.tsx:101`), and empty Instagram captions cause most posts to fall back to `"Recent Work"`. The user wants:

1. **Working category filters** — admin-controlled, not caption-guessed
2. **Simpler admin** — remove Instagram tooling and low-value pages
3. **Image management via URLs** — paste links, not Instagram sync/upload-first
4. **Cooler hero** — cinematic upgrade without breaking mobile layout
5. **Replace Before/After** — new homepage section with stronger visual impact

---

## Root Cause Analysis

| Problem | Root cause | Evidence |
|---------|------------|----------|
| Categories not functional | Gallery data from IG feed; categories inferred from empty captions or static JSON not in CMS | `lib/projects.ts:25-48`, `instagram-feed.json` captions are `""` |
| Admin confusion | Two gallery paths: Instagram page + optional CMS projects | `AdminProjectsEditor.tsx:127-133` |
| Instagram dependency | ~40 files reference Instagram sync/CDN | grep count across `lib/instagram/*`, API routes, admin pages |
| Before/After feels weak | Single slider carousel, placeholder images, separate admin page | `BeforeAfterShowcase.tsx`, `content/before-after.ts` |

---

## Technical Solution (Synthesized)

### A. CMS-first gallery (replaces Instagram)

Make **`cms.projects`** the single gallery source. Remove Instagram feed from `getProjects()`.

**Data model extension** (`lib/cms/schema.ts`, `content/projects.ts`):

```typescript
// Predefined categories (shared constant)
export const PROJECT_CATEGORIES = [
  "All", // filter-only, not stored
  "Glass Balustrade",
  "Aluminium Windows",
  "Privacy Screens",
  "Carpentry",
  "Steel Work",
  "Recent Work",
] as const;

export type Project = {
  id: string;
  title: string;
  category: string;        // must match predefined list (or validated custom)
  src: string;             // cover image URL (https or /images/...)
  images?: string[];       // additional slide URLs
  alt: string;
  description: string;
  highlights?: string[];
  objectPosition?: string;
  featured?: boolean;      // NEW — for homepage spotlight section
  sortOrder?: number;      // NEW — manual ordering in gallery
};
```

**`getProjects()` simplified** (`lib/projects.ts`):

```typescript
export async function getProjects(): Promise<Project[]> {
  const cms = (await getCmsProjects()).filter(isValidProject);
  if (cms.length) return sortByOrder(cms);
  return defaultProjects.filter(isValidProject);
}
// Remove: readInstagramFeed, instagramPostToProject, inferCategoryFromCaption
```

**One-time migration**: Convert existing `instagram-feed.json` posts + `instagram-post-meta.json` into CMS projects (script or admin "Import from legacy feed" button). Map shortcode → project id `project-{shortcode}`.

---

### B. Admin simplification

#### Keep (core ops)

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard — strip Instagram widgets |
| `/admin/inquiries` | Lead management |
| `/admin/content` | Site copy, services, materials |
| `/admin/projects` | **Primary gallery manager** (revamped) |
| `/admin/settings` | Env hints, site URL — remove IG session block |
| `/admin/accounts` | Admin users (if multi-user needed) |

#### Remove or merge

| Route | Action | Rationale |
|-------|--------|-----------|
| `/admin/instagram` | **Delete** | User request — link-based images only |
| `/admin/before-after` | **Delete** | Section replaced; no separate CMS |
| `/admin/business` | **Delete** | Orders/invoices unused for marketing site |
| `/admin/security` | **Merge into Settings** | Checklist + recent events as collapsible panel |
| `/admin/logs` | **Optional keep** | Useful for debugging; hide from nav if desired, link from Settings |

**Updated `AdminNav.tsx` links**:

```typescript
const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inquiries", label: "Enquiries" },
  { href: "/admin/content", label: "Site content" },
  { href: "/admin/projects", label: "Gallery" },  // renamed
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/accounts", label: "Accounts" },
];
```

---

### C. Projects admin — URL-first editor

Replace `AdminProjectsEditor` UX:

```
┌─────────────────────────────────────────────────────────┐
│ Gallery projects                                        │
│ Paste image URLs (CDN, Supabase, or /public paths).     │
├─────────────────────────────────────────────────────────┤
│ Project 1                                    [Delete]   │
│ Title: [________________]                               │
│ Category: [Glass Balustrade ▼]  ← select, not free text │
│ Cover URL: [https://...]  [preview thumb]               │
│ Extra slides (one URL per line):                        │
│ [textarea]                                              │
│ Description: [textarea]                                 │
│ □ Featured on homepage    Order: [3]                    │
├─────────────────────────────────────────────────────────┤
│ [+ Add project]                        [Save gallery]   │
└─────────────────────────────────────────────────────────┘
```

**`ImageUploadField` changes**:
- Rename label to "Image URL"
- Keep URL text input as primary
- Move file upload to secondary "Or upload to Supabase" (optional)
- Validate URL on blur: must be `https://`, `http://`, or `/images/`

**Remove** all Instagram links/copy from `AdminProjectsEditor`, `AdminInsightsPanel`, `AdminSettingsPanel`, dashboard description.

---

### D. Functional category filters

**Frontend** (`GalleryGrid.tsx`):

```typescript
import { GALLERY_FILTER_CATEGORIES } from "@/lib/project-categories";

// Always show filters when projects.length >= 2 (not when unique categories <= 1)
const categories = useMemo(() => {
  const used = new Set(projects.map((p) => p.category));
  return ["All", ...GALLERY_FILTER_CATEGORIES.filter((c) => used.has(c))];
}, [projects]);

// Optional: show count badges
// "Glass Balustrade (4)"
```

**URL sync** (nice-to-have): `/gallery?category=Glass+Balustrade` via `useSearchParams` so filters are shareable.

**Admin validation** (`projectSchema`): category must be in allowed list (Zod enum or refine).

---

### E. Remove Instagram infrastructure

Delete or deprecate in phased commits:

| Layer | Files to remove |
|-------|-----------------|
| Admin UI | `app/admin/instagram/`, `AdminInstagramManager.tsx` |
| API | `app/api/admin/instagram-*`, `app/api/instagram/image/` |
| Lib | `lib/instagram/*`, `lib/instagram-embed.ts` |
| Components | `InstagramVideoModal.tsx` (if unused in hero) |
| Scripts | `scripts/sync-instagram.mjs`, `scripts/discover-and-sync.mjs`, etc. |
| Content | `content/instagram-feed.json`, `instagram-post-urls.json`, `instagram-post-meta.json` |
| Package | `"sync:instagram"` script in `package.json` |

**Keep** (public social link only):
- `site.instagramHandle` / `site.instagramUrl` in CMS for Contact footer
- CSP `instagram.com` in `frame-src` only if embed still used — otherwise trim

**Update**:
- `next.config.ts` — remove `cdninstagram.com` from `images.remotePatterns` if no longer needed (keep Supabase + unsplash)
- `lib/admin/insights.ts` — replace Instagram block with gallery stats (project count, categories, featured count)
- `README.md` — document URL-based gallery workflow

**Supabase**: Leave `instagram_feed` table migration in place (no destructive DB migration required); stop reading/writing it.

---

### F. Replace Before/After → **Featured Work Spotlight**

Remove `BeforeAfterShowcase` from homepage. Add **`FeaturedSpotlight`** section.

**Concept**: Bento grid highlighting 1–3 CMS projects marked `featured: true`. More portfolio-forward than a slider.

```
┌──────────────────────────────────────────────────────────┐
│  EYEBROW: Signature work                                 │
│  TITLE: Built to the last detail                         │
├────────────────────────────┬──────────────┬──────────────┤
│                            │   Project B  │   Project C  │
│   Project A (large)        │   (medium)   │   (medium)   │
│   category + title         │              │              │
│   hover: lift + CTA        │              │              │
└────────────────────────────┴──────────────┴──────────────┘
         [ View full gallery → ]
```

**Component**: `components/sections/FeaturedSpotlight.tsx`

```typescript
type Props = { projects: Project[] };

export function FeaturedSpotlight({ projects }: Props) {
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  if (featured.length === 0) return null;
  // Bento layout: 1 col mobile, asymmetric grid lg+
  // Reuse GalleryCardPreview or larger variant
  // Link each tile to /gallery/[id]
}
```

**Homepage** (`app/page.tsx`):

```typescript
// Remove BeforeAfterShowcase dynamic import
<FeaturedSpotlight projects={projects} />
<ProjectGallery projects={projects} />
```

**CMS cleanup**:
- Remove `beforeAfterSection`, `beforeAfterItems` from `CmsData` (or leave in DB but unused — prefer clean removal)
- Delete `AdminBeforeAfterEditor`, `app/admin/before-after/`, `app/api/admin/cms/before-after/`
- Delete `BeforeAfterCompare.tsx`, `BeforeAfterShowcase.tsx`, `content/before-after.ts` if fully unused

**Fallback**: If no featured projects, auto-pick first 3 from gallery sorted by `sortOrder`.

---

### G. Hero upgrade — cooler & cinematic

Build on existing `hero-cinematic` CSS without breaking mobile CTAs/trust bar.

**Recommended enhancements** (desktop-first, all respect `prefers-reduced-motion`):

| Enhancement | File | Detail |
|-------------|------|--------|
| Staggered headline entrance | `Hero.tsx` | Framer Motion word/line stagger on load (desktop); keep static on mobile |
| Glass copy panel | `globals.css` | Subtle `backdrop-blur` + gradient border behind headline on lg+ |
| Accent motion lines | `HeroVisual.tsx` | Re-enable `hero-accent` SVG rings (already in CSS L537+) as overlay |
| Desktop hotspots | `HeroHotspots.tsx` | Flip to `lg:block hidden` with positions tuned for pool-house photo |
| Improved color grade | `globals.css` | Stronger teal/navy split-tone on overlay; animated subtle glow pulse |
| Scroll hint | `Hero.tsx` | Small chevron bounce at bottom (desktop only) |
| Parallax depth | `HeroVisual.tsx` | `useScroll` + slight Y transform on image (max 8px, reduced motion off) |

**Pseudo-structure**:

```tsx
// HeroVisual.tsx
<div className="hero-visual">
  <Image ... className="hero-ken-burns hero-parallax-layer" />
  <HeroAccentLines />           // new — uses existing .hero-accent-* CSS
  <div className="hero-visual-glow hero-glow-pulse" />
  <div className="hero-visual-overlay" />
  <div className="hero-visual-vignette" />
</div>

// Hero.tsx (desktop)
<motion.div className="hero-glass-panel">
  <motion.h1 variants={headlineVariants} initial="hidden" animate="show">
    ...
  </motion.h1>
</motion.div>
<HeroHotspots />  // lg only
```

**Do NOT** re-add mobile hotspots (removed intentionally). **Do NOT** reintroduce Instagram video modal unless user asks.

**Optional admin hook** (phase 2): CMS fields `heroMobileSrc`, `heroDesktopSrc` URLs editable in Site content — avoids redeploy for photo swaps.

---

## Implementation Steps

### Phase 1 — Data model & gallery source (Backend)
1. Add `lib/project-categories.ts` with shared category constants
2. Extend `Project` type + `projectSchema` with `featured`, `sortOrder`
3. Rewrite `getProjects()` to CMS-only; add `getFeaturedProjects()`
4. Write migration helper: `scripts/migrate-instagram-to-cms.mjs` (reads feed + meta → outputs CMS projects JSON)
5. Run migration against production CMS via admin save or direct Supabase update

**Deliverable**: Gallery renders from CMS; categories editable in admin

### Phase 2 — Admin revamp & page removal (Fullstack)
1. Rebuild `AdminProjectsEditor` — category select, URL fields, featured toggle, sort order
2. Simplify `ImageUploadField` — URL-primary labeling
3. Update `AdminNav` — remove Instagram, Before/After, Business, Security, Logs (or demote Logs)
4. Delete admin pages + route files listed above
5. Refactor `AdminInsightsPanel` + dashboard copy — gallery health instead of Instagram
6. Clean `AdminSettingsPanel` — remove Instagram session instructions

**Deliverable**: Streamlined admin with Gallery as single image entry point

### Phase 3 — Category filters & gallery UX (Frontend)
1. Fix `GalleryGrid` — always show filters when 2+ projects; use shared category list
2. Add optional URL query param sync for active filter
3. Show project count per category in filter pills
4. Update `/gallery` page header copy (remove Instagram references)

**Deliverable**: Category buttons filter correctly on homepage compact grid + full gallery page

### Phase 4 — Replace Before/After section (Frontend)
1. Create `FeaturedSpotlight.tsx` + styles in `globals.css`
2. Swap in `app/page.tsx`; remove Before/After dynamic import
3. Remove before/after CMS types, API, admin, components
4. Seed 2–3 projects as `featured: true` in defaults or migration

**Deliverable**: New bento spotlight section on homepage

### Phase 5 — Hero cinematic upgrade (Frontend)
1. Add `HeroAccentLines.tsx` using existing CSS
2. Update `HeroVisual.tsx` — parallax layer, glow pulse
3. Update `Hero.tsx` — glass panel, staggered headline (desktop)
4. Re-enable `HeroHotspots` on `lg+` with recalibrated positions for current pool photo
5. Add scroll hint; test laptop + mobile + reduced motion

**Deliverable**: Visually richer hero without layout regressions

### Phase 6 — Instagram removal & cleanup (Backend)
1. Delete Instagram lib, API routes, admin page, scripts
2. Update `next.config.ts` CSP/image patterns
3. Update `README.md`, remove dead imports project-wide
4. Grep verify zero runtime references to `readInstagramFeed`

**Deliverable**: No Instagram sync code path; social link in Contact remains

### Phase 7 — Verification
1. `npm run build` — zero TS errors
2. Manual: Admin → add project via URL, set category, mark featured, save
3. Manual: Homepage — hero, spotlight, gallery filters
4. Manual: `/gallery` — all category filters
5. Manual: Mobile hero — CTAs, trust bar, no hotspot clutter
6. Deploy to Vercel; hard refresh

---

## Key Files

| File | Operation | Description |
|------|-----------|-------------|
| `lib/projects.ts` | Modify | CMS-only project loading; remove Instagram |
| `lib/project-categories.ts` | **Create** | Shared category enum |
| `lib/cms/schema.ts` | Modify | Add `featured`, `sortOrder`; category validation |
| `lib/cms/types.ts` | Modify | Extend Project; remove before/after types (optional) |
| `components/admin/AdminProjectsEditor.tsx` | Modify | URL-first gallery editor with category select |
| `components/admin/AdminNav.tsx` | Modify | Remove dead nav links |
| `components/admin/AdminInsightsPanel.tsx` | Modify | Gallery stats widget |
| `components/gallery/GalleryGrid.tsx` | Modify | Reliable category filtering |
| `components/sections/FeaturedSpotlight.tsx` | **Create** | Replaces Before/After |
| `components/sections/Hero.tsx` | Modify | Glass panel, motion, scroll hint |
| `components/hero/HeroVisual.tsx` | Modify | Accent lines, parallax, glow |
| `components/hero/HeroHotspots.tsx` | Modify | Desktop-only, retuned positions |
| `app/page.tsx` | Modify | Swap Before/After → FeaturedSpotlight |
| `app/admin/instagram/` | **Delete** | Instagram admin |
| `app/admin/before-after/` | **Delete** | Before/after admin |
| `app/admin/business/` | **Delete** | Unused business hub |
| `app/admin/security/` | **Delete** | Merge into settings |
| `lib/instagram/*` | **Delete** | Entire Instagram sync layer |
| `app/api/admin/instagram-*` | **Delete** | Instagram API routes |
| `next.config.ts` | Modify | Trim Instagram CSP/image domains |
| `README.md` | Modify | Document URL gallery workflow |

---

## Risks and Mitigation

| Risk | Mitigation |
|------|------------|
| Existing live gallery breaks when IG removed | Run migration script first; deploy CMS projects before deleting IG code |
| Instagram CDN URLs expire | User pastes stable URLs (Supabase Storage or `/public/images`); document in admin |
| Category filter still empty with 1 project | Show filters only when `projects.length >= 2`; message when single project |
| Hero motion hurts performance | Cap animations to desktop; `useReducedMotion` disables parallax/stagger |
| Removing admin pages breaks bookmarks | Add redirects in `middleware.ts` or `next.config` redirects: `/admin/instagram` → `/admin/projects` |
| Before/after content lost | Migrate best after image as a featured project before deleting CMS fields |

---

## Alternative Considered: Before/After Replacement Options

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Featured Spotlight bento** | Uses real portfolio; admin already has projects | Needs `featured` flag | **Recommended** |
| Process timeline (Design→Install) | Educational | Generic, not visual | Skip |
| Testimonials carousel | Social proof | Needs new CMS content type | Phase 2 optional |
| Stats + marquee | Fast to build | Less engaging | Fallback only |

---

## Multi-Model Notes

**External model sessions**: `codeagent-wrapper` was **not available** on this Windows environment. Analysis below synthesizes intended Codex (backend) + Gemini (frontend) perspectives directly from codebase review.

### Codex (Backend) consensus
- CMS-first is the correct architecture; Instagram sync adds fragility (CDN expiry, session cookies, dual data paths)
- Category must be a validated field on `Project`, not inferred from captions
- Phased deletion: migrate data → switch reader → delete Instagram code
- Keep Supabase table; don't run destructive migrations

### Gemini (Frontend) consensus
- Bento featured section beats slider for construction portfolio sites
- Hero upgrades should layer on existing cinematic CSS, not rewrite layout
- Category pills need visible active state + counts; URL sync improves shareability
- Admin should feel like one "Gallery" page, not Instagram + Projects

---

## SESSION_ID (for /ccg:execute use)

- **CODEX_SESSION**: N/A — `codeagent-wrapper` not installed on this machine
- **GEMINI_SESSION**: N/A — `codeagent-wrapper` not installed on this machine

Re-run `/multi-plan` on a machine with `~/.claude/bin/codeagent-wrapper` to obtain live dual-model sessions for `/ccg:execute resume`.

---

## Suggested Commit Sequence (for execute phase)

1. `feat(cms): CMS-first gallery with categories and featured flag`
2. `feat(admin): URL-first gallery editor; remove unused admin pages`
3. `feat(home): replace before/after with featured spotlight section`
4. `feat(hero): cinematic hero upgrades with motion-safe defaults`
5. `chore: remove Instagram sync infrastructure`
6. `docs: update README for link-based gallery workflow`
