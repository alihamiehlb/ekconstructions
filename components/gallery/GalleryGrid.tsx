"use client";

import { GalleryCardPreview } from "@/components/gallery/GalleryCardPreview";
import { GalleryEmptyState } from "@/components/gallery/GalleryEmptyState";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project } from "@/content/projects";
import { PROJECT_CATEGORIES } from "@/lib/project-categories";
import { projectHasGallery } from "@/lib/project-images";
import { ArrowUpRight, Layers } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

type Props = {
  projects: Project[];
  totalCount?: number;
  showAllLink?: boolean;
  title?: string;
  subtitle?: string;
  description?: string;
  compact?: boolean;
  syncUrl?: boolean;
  urlCategory?: string | null;
  sectionId?: string;
  instagramUrl?: string;
  instagramHandle?: string;
};

function ProjectCard({
  project,
  index,
  compact,
  featured,
}: {
  project: Project;
  index: number;
  compact?: boolean;
  featured?: boolean;
}) {
  return (
    <article
      className={`h-full ${featured && !compact ? "sm:col-span-2" : ""} ${compact ? "gallery-card-snap shrink-0 sm:shrink lg:shrink-0" : ""}`}
    >
      <Link
        href={`/gallery/${project.id}`}
        className={`gallery-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ek-navy/8 bg-white shadow-[0_8px_30px_-18px_rgba(10,10,10,0.35)] hover:border-ek-teal/30 hover:shadow-[0_16px_40px_-20px_rgba(219,32,34,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ek-teal ${
          compact ? "w-[78vw] max-w-[320px] p-2.5 sm:w-auto sm:max-w-none sm:p-3" : "p-3 sm:p-4"
        }`}
      >
        <GalleryCardPreview project={project} index={index} compact={compact} featured={featured} />

        <div className="gallery-card-caption pointer-events-none absolute inset-x-3 bottom-[4.5rem] z-10 rounded-lg bg-gradient-to-t from-ek-navy/90 via-ek-navy/55 to-transparent px-3 pb-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:bottom-[5rem]">
          <p className="text-[9px] font-semibold tracking-[0.14em] text-ek-teal uppercase">
            {project.category}
          </p>
          <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-white">
            {project.title}
          </p>
        </div>

        <span className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ek-navy shadow-md opacity-0 transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
        {projectHasGallery(project) && (
          <span className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-ek-navy/80 px-2 py-1 text-[9px] font-bold text-white backdrop-blur-sm">
            <Layers className="h-3 w-3" aria-hidden />
            {project.images?.length ?? 0} photos
          </span>
        )}

        <div className={`relative flex flex-1 flex-col ${compact ? "px-0.5 pt-3 pb-0.5" : "px-1 pt-4 pb-1"}`}>
          <p className="text-[9px] font-semibold tracking-[0.16em] text-ek-teal uppercase sm:text-[10px]">
            {project.category}
          </p>
          {featured && !compact && (
            <span className="mt-2 inline-flex w-fit rounded-full bg-ek-teal/10 px-2.5 py-0.5 text-[9px] font-bold tracking-[0.12em] text-ek-teal uppercase">
              Featured
            </span>
          )}
          <h3
            className={`mt-1.5 font-bold leading-snug text-ek-navy transition-colors group-hover:text-ek-teal ${
              compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"
            }`}
          >
            {project.title}
          </h3>
          {!compact && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-ek-muted sm:text-sm">
              {project.description}
            </p>
          )}
        </div>
      </Link>
    </article>
  );
}

export function GalleryGrid({
  projects,
  totalCount,
  showAllLink = false,
  title = "Recent Projects",
  subtitle = "Portfolio",
  description,
  compact = false,
  syncUrl = false,
  urlCategory = null,
  sectionId = "gallery",
  instagramUrl,
  instagramHandle,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [localFilter, setLocalFilter] = useState("All");
  const activeFilter =
    syncUrl && urlCategory && (urlCategory === "All" || PROJECT_CATEGORIES.includes(urlCategory as never))
      ? urlCategory
      : syncUrl
        ? "All"
        : localFilter;

  const categories = useMemo(() => {
    const used = new Set(projects.map((p) => p.category));
    return ["All", ...PROJECT_CATEGORIES.filter((c) => used.has(c))];
  }, [projects]);

  const counts = useMemo(() => {
    const map = new Map<string, number>();
    map.set("All", projects.length);
    for (const p of projects) {
      map.set(p.category, (map.get(p.category) ?? 0) + 1);
    }
    return map;
  }, [projects]);

  const filtered =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const setFilter = useCallback(
    (cat: string) => {
      if (syncUrl) {
        const params = new URLSearchParams(
          typeof window !== "undefined" ? window.location.search : "",
        );
        if (cat === "All") params.delete("category");
        else params.set("category", cat);
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      } else {
        setLocalFilter(cat);
      }
    },
    [pathname, router, syncUrl],
  );

  const gridClass = compact
    ? "gallery-scroll-row flex gap-4 overflow-x-auto pb-3 snap-x snap-mandatory lg:grid lg:grid-cols-2 lg:gap-5 lg:overflow-visible lg:pb-0 xl:grid-cols-4 xl:gap-6"
    : "grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:gap-8";

  const showFilters = projects.length >= 2 && categories.length > 1;
  const catalogTotal = totalCount ?? projects.length;

  const sectionClass =
    projects.length === 0
      ? "section-block bg-gradient-to-b from-white via-ek-gray/40 to-ek-gray/30 pb-16 pt-8"
      : "section-block bg-gradient-to-b from-white via-ek-gray/40 to-ek-gray/30 pb-12 pt-6 sm:pb-16 sm:pt-8";

  return (
    <section id={sectionId} className={sectionClass}>
      <div className="landing-container mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow={subtitle} title={title} description={description} />
        {showFilters && projects.length > 0 && (
          <div
            className="gallery-filter-scroll flex max-w-full gap-2 overflow-x-auto pb-1 sm:max-w-xl sm:flex-wrap sm:justify-end sm:overflow-visible"
            role="group"
            aria-label="Filter projects by category"
          >
            {categories.map((cat) => {
              const count = counts.get(cat) ?? 0;
              const active = activeFilter === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  aria-pressed={active}
                  className={`gallery-filter-pill shrink-0 ${
                    active ? "gallery-filter-pill--active" : ""
                  }`}
                >
                  {cat}
                  <span className="ml-1 opacity-70">({count})</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {projects.length === 0 ? (
        <div className="landing-container">
          <GalleryEmptyState
            variant="page"
            instagramUrl={instagramUrl}
            instagramHandle={instagramHandle}
          />
        </div>
      ) : (
        <>
          <div className={`landing-container ${gridClass}`}>
            {filtered.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={i}
                compact={compact}
                featured={Boolean(project.featured) && !compact}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="landing-container py-12">
              <GalleryEmptyState variant="filter" onShowAll={() => setFilter("All")} />
            </div>
          )}

          {showAllLink && (
            <div className="landing-container mt-8 flex flex-col items-center gap-2 text-center sm:mt-10">
              {catalogTotal > projects.length && (
                <p className="text-xs text-ek-muted">
                  Showing {projects.length} of {catalogTotal} projects
                </p>
              )}
              <Link href="/gallery" className="btn-primary">
                View full gallery
              </Link>
            </div>
          )}
        </>
      )}
    </section>
  );
}
