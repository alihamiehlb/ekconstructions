"use client";

import { GalleryCardPreview } from "@/components/gallery/GalleryCardPreview";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { Project } from "@/content/projects";
import { PROJECT_CATEGORIES } from "@/lib/project-categories";
import { projectHasGallery } from "@/lib/project-images";
import { motion } from "framer-motion";
import { ArrowUpRight, Layers } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";

type Props = {
  projects: Project[];
  showAllLink?: boolean;
  title?: string;
  subtitle?: string;
  compact?: boolean;
  syncUrl?: boolean;
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
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`h-full ${featured && !compact ? "sm:col-span-2" : ""}`}
    >
      <Link
        href={`/gallery/${project.id}`}
        className={`gallery-card group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ek-navy/8 bg-white shadow-[0_8px_30px_-18px_rgba(10,10,10,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:border-ek-teal/30 hover:shadow-[0_22px_48px_-24px_rgba(219,32,34,0.28)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ek-teal ${
          compact ? "p-2 sm:p-2.5" : "p-3 sm:p-4"
        }`}
      >
        <GalleryCardPreview project={project} index={index} compact={compact} featured={featured} />
        <span className="absolute top-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ek-navy shadow-md opacity-0 transition-all duration-300 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" aria-hidden />
        </span>
        {projectHasGallery(project) && (
          <span className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-ek-navy/80 px-2 py-1 text-[9px] font-bold text-white backdrop-blur-sm">
            <Layers className="h-3 w-3" aria-hidden />
            Slides
          </span>
        )}

        <div className={`flex flex-1 flex-col ${compact ? "px-1 pt-3 pb-1" : "px-1 pt-4 pb-1"}`}>
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
    </motion.article>
  );
}

export function GalleryGrid({
  projects,
  showAllLink = false,
  title = "Recent Projects",
  subtitle = "Portfolio",
  compact = false,
  syncUrl = false,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [localFilter, setLocalFilter] = useState("All");
  const urlCategory = syncUrl ? searchParams.get("category") : null;
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
        const params = new URLSearchParams(searchParams.toString());
        if (cat === "All") params.delete("category");
        else params.set("category", cat);
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
      } else {
        setLocalFilter(cat);
      }
    },
    [pathname, router, searchParams, syncUrl],
  );

  const gridClass = compact
    ? "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-5"
    : "grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:gap-8";

  const showFilters = projects.length >= 2 && categories.length > 1;

  if (projects.length === 0) {
    return (
      <section id="gallery" className="section-block bg-gradient-to-b from-white via-ek-gray/40 to-ek-gray/30 pb-16 pt-8">
        <div className="landing-container">
          <SectionHeading eyebrow={subtitle} title={title} />
          <div className="gallery-empty-state mt-10 rounded-2xl border border-dashed border-ek-navy/12 bg-white px-6 py-14 text-center">
            <p className="text-base font-bold text-ek-navy">Gallery coming soon</p>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ek-muted">
              New project photos are being added. Check back shortly or contact us for recent work.
            </p>
            <Link href="/#contact" className="btn-primary mt-6 inline-flex">
              Request a quote
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="section-block bg-gradient-to-b from-white via-ek-gray/40 to-ek-gray/30 pb-12 pt-6 sm:pb-16 sm:pt-8">
      <div className="landing-container mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading eyebrow={subtitle} title={title} />
        {showFilters && (
          <div
            className={`flex flex-wrap gap-2 ${compact ? "sm:max-w-md sm:justify-end" : ""}`}
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
                  className={`min-h-[36px] rounded-full px-4 py-2 text-[10px] font-semibold tracking-wide uppercase transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ek-teal ${
                    active
                      ? "bg-ek-teal text-white shadow-md ring-2 ring-ek-teal/30 ring-offset-1 ring-offset-white"
                      : "border border-ek-navy/10 bg-white text-ek-muted hover:border-ek-teal/35 hover:text-ek-navy hover:shadow-sm"
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

      {filtered.length === 0 && projects.length > 0 && (
        <div className="landing-container py-12">
          <div className="gallery-empty-state rounded-2xl border border-ek-navy/8 bg-white px-6 py-10 text-center">
            <p className="text-sm font-medium text-ek-navy">No projects in this category</p>
            <p className="mt-2 text-sm text-ek-muted">Try another filter or view all projects.</p>
            <button
              type="button"
              onClick={() => setFilter("All")}
              className="mt-4 text-xs font-semibold tracking-wide text-ek-teal uppercase hover:underline"
            >
              Show all
            </button>
          </div>
        </div>
      )}

      {showAllLink && (
        <div className="landing-container mt-8 text-center sm:mt-10">
          <Link href="/gallery" className="btn-primary">
            View Full Gallery
          </Link>
        </div>
      )}
    </section>
  );
}
