"use client";

import type { Project } from "@/content/projects";
import { getProjectImages } from "@/lib/project-images";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  projects: Project[];
};

function SpotlightTile({
  project,
  layout,
  index,
}: {
  project: Project;
  layout: "hero" | "side";
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const src = getProjectImages(project)[0];

  return (
    <motion.article
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={layout === "hero" ? "featured-spotlight-hero" : "featured-spotlight-side"}
    >
      <Link
        href={`/gallery/${project.id}`}
        className="featured-spotlight-link group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-2xl border border-ek-navy/8 bg-ek-navy shadow-[0_20px_50px_-24px_rgba(11,29,38,0.45)] transition duration-300 hover:-translate-y-1 hover:border-ek-teal/30 hover:shadow-[0_28px_60px_-20px_rgba(219,32,34,0.25)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ek-teal sm:min-h-[260px] lg:min-h-0"
      >
        <Image
          src={src}
          alt={project.alt}
          fill
          sizes={
            layout === "hero"
              ? "(max-width: 1024px) 100vw, 58vw"
              : "(max-width: 1024px) 100vw, 28vw"
          }
          className="object-cover transition duration-700 group-hover:scale-[1.04]"
          style={{ objectPosition: project.objectPosition ?? "center" }}
          quality={88}
          unoptimized={src.startsWith("http")}
        />
        <div className="featured-spotlight-overlay absolute inset-0" aria-hidden />
        <div className="relative z-10 mt-auto p-5 sm:p-6">
          <p className="text-[9px] font-semibold tracking-[0.2em] text-ek-teal uppercase sm:text-[10px]">
            {project.category}
          </p>
          <h3
            className={`mt-2 font-black leading-tight text-white uppercase ${
              layout === "hero" ? "text-xl sm:text-2xl lg:text-3xl" : "text-base sm:text-lg"
            }`}
          >
            {project.title}
          </h3>
          {layout === "hero" && (
            <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-white/75">
              {project.description}
            </p>
          )}
          <span className="mt-4 inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.16em] text-white uppercase opacity-90 transition group-hover:text-ek-teal">
            View project
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}

export function FeaturedSpotlight({ projects }: Props) {
  if (projects.length === 0) return null;

  const [primary, ...rest] = projects;

  return (
    <section id="featured" className="section-block section-block-muted relative overflow-hidden">
      <div className="featured-spotlight-bg pointer-events-none absolute inset-0" aria-hidden />

      <div className="landing-container relative">
        <SectionHeading
          eyebrow="Signature work"
          title="Built to the last detail"
          description="Hand-picked projects showcasing aluminium glazing, glass balustrades, and precision finishing across Sydney."
          align="center"
        />

        <div className="featured-spotlight-grid mt-10 lg:mt-12">
          <SpotlightTile project={primary} layout="hero" index={0} />
          {rest.length > 0 && (
            <div className="featured-spotlight-stack">
              {rest.map((project, i) => (
                <SpotlightTile key={project.id} project={project} layout="side" index={i + 1} />
              ))}
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link href="/gallery" className="btn-primary">
            View full gallery
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
