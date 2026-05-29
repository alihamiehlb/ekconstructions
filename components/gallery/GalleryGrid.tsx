"use client";

import { SectionReveal } from "@/components/ui/SectionReveal";
import type { Project } from "@/content/projects";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

type Props = {
  projects: Project[];
  showAllLink?: boolean;
  title?: string;
  subtitle?: string;
  compact?: boolean;
};

function ProjectCard({
  project,
  index,
  compact,
}: {
  project: Project;
  index: number;
  compact?: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ delay: index * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className="h-full"
    >
      <Link
        href={`/gallery/${project.id}`}
        className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-ek-navy/8 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-ek-teal/25 hover:shadow-[0_16px_40px_-20px_rgba(11,29,38,0.35)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ek-teal ${
          compact ? "p-2 sm:p-2.5" : "p-3 sm:p-4"
        }`}
      >
        <div
          className={`relative w-full overflow-hidden rounded-xl bg-ek-gray ${
            compact ? "aspect-[4/3]" : "aspect-[4/3] sm:aspect-[5/4]"
          }`}
        >
          <Image
            src={project.src}
            alt={project.alt}
            fill
            sizes={
              compact
                ? "(max-width: 768px) 50vw, 20vw"
                : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            }
            className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            style={{ objectPosition: project.objectPosition ?? "center" }}
            loading={index < 4 ? "eager" : "lazy"}
            quality={88}
          />
          <span className="absolute top-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-ek-navy shadow-md opacity-0 transition-all duration-300 group-hover:opacity-100">
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </span>
        </div>

        <div className={`flex flex-1 flex-col ${compact ? "px-1 pt-3 pb-1" : "px-1 pt-4 pb-1"}`}>
          <p className="text-[9px] font-semibold tracking-[0.16em] text-ek-teal uppercase sm:text-[10px]">
            {project.category}
          </p>
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
}: Props) {
  const [filter, setFilter] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(projects.map((p) => p.category)))],
    [projects],
  );

  const filtered =
    filter === "All" ? projects : projects.filter((p) => p.category === filter);

  const gridClass = compact
    ? "grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-5"
    : "grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:gap-8";

  return (
    <section id="gallery" className="bg-ek-gray/30 pb-10 pt-2 sm:pb-12">
      <div className="landing-container mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <SectionReveal>
          <div>
            <p className="text-[10px] font-semibold tracking-[0.35em] text-ek-teal uppercase">
              {subtitle}
            </p>
            <h2 className="mt-1 text-xl font-black tracking-tight text-ek-navy uppercase sm:text-2xl md:text-3xl">
              {title}
            </h2>
          </div>
        </SectionReveal>
        {!compact && (
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={`min-h-[36px] rounded-full px-4 py-2 text-[10px] font-semibold tracking-wide uppercase transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ek-teal ${
                  filter === cat
                    ? "bg-ek-teal text-white shadow-sm"
                    : "border border-ek-navy/10 bg-white text-ek-muted hover:border-ek-teal/30 hover:text-ek-navy"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={`landing-container ${gridClass}`}>
        {filtered.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} compact={compact} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="landing-container py-12 text-center text-sm text-ek-muted">
          No projects in this category yet.
        </p>
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
