"use client";

import { ImageCarousel } from "@/components/gallery/ImageCarousel";
import { ProjectImage } from "@/components/gallery/ProjectImage";
import { useSite } from "@/components/providers/SiteProvider";
import type { Project } from "@/content/projects";
import { getProjectImages } from "@/lib/project-images";
import { ArrowLeft, ArrowRight, Instagram } from "lucide-react";
import Link from "next/link";

type Props = {
  project: Project;
  projects: Project[];
  index: number;
};

export function ProjectDetailScreen({ project, projects, index }: Props) {
  const site = useSite();
  const images = getProjectImages(project);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];

  return (
    <main id="main-content" className="bg-ek-navy pt-[68px] text-white lg:pt-[74px]">
      <div className="relative">
        {images.length > 1 ? (
          <ImageCarousel
            images={images}
            alt={project.alt}
            objectPosition={project.objectPosition}
            priority
            variant="hero"
          />
        ) : (
          <div className="relative min-h-[52vh] lg:min-h-[68vh]">
            <ProjectImage
              src={project.src}
              projectId={project.id}
              alt={project.alt}
              fill
              priority
              quality={92}
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: project.objectPosition ?? "center" }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ek-navy via-ek-navy/45 to-ek-navy/15" />
            <div className="absolute inset-0 bg-gradient-to-r from-ek-navy/50 to-transparent" />
          </div>
        )}

        <div className="landing-container absolute inset-0 flex min-h-[52vh] flex-col justify-between py-6 sm:py-8 lg:min-h-[68vh] lg:py-10">
          <Link
            href="/gallery"
            className="relative z-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[10px] font-semibold tracking-[0.18em] text-white uppercase backdrop-blur-sm transition hover:border-ek-teal hover:text-ek-teal"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to gallery
          </Link>

          <div className="relative z-10 max-w-3xl pb-4 lg:pb-8">
            <span className="inline-block rounded-[2px] bg-ek-teal px-2.5 py-1 text-[10px] font-bold tracking-[0.16em] text-white uppercase">
              {project.category}
            </span>
            <h1 className="mt-4 text-2xl font-black tracking-tight uppercase sm:text-3xl md:text-4xl lg:text-5xl">
              {project.title}
            </h1>
            <p className="mt-2 text-xs text-white/60 sm:text-sm">
              Project {index + 1} of {projects.length}
              {images.length > 1 ? ` · ${images.length} photos` : ""}
            </p>
          </div>
        </div>
      </div>

      {images.length > 1 && (
        <div className="landing-container -mt-2 border-b border-white/10 py-6 sm:py-8">
          <p className="text-[10px] font-semibold tracking-[0.3em] text-ek-teal uppercase">
            Gallery
          </p>
          <ul className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {images.map((src, i) => (
              <li key={src} className="shrink-0">
                <div className="relative h-20 w-28 overflow-hidden rounded-lg border border-white/15 sm:h-24 sm:w-36">
                  <ProjectImage
                    src={src}
                    projectId={project.id}
                    alt=""
                    fill
                    sizes="144px"
                    className="object-cover"
                    style={{ objectPosition: project.objectPosition ?? "center" }}
                  />
                  <span className="absolute bottom-1 right-1 rounded bg-black/50 px-1.5 text-[9px] font-bold text-white">
                    {i + 1}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="landing-container grid gap-10 py-10 sm:py-12 lg:grid-cols-[1fr_320px] lg:gap-16 lg:py-16">
        <div>
          <h2 className="text-[10px] font-semibold tracking-[0.3em] text-ek-teal uppercase">
            Overview
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/82 sm:text-lg">
            {project.description}
          </p>

          {project.highlights && project.highlights.length > 0 && (
            <ul className="mt-8 flex flex-wrap gap-2">
              {project.highlights.map((item) => (
                <li
                  key={item}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-medium text-white/90"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>

        <aside className="h-fit rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm lg:sticky lg:top-24">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-ek-teal uppercase">
            Interested?
          </p>
          <p className="mt-3 text-sm leading-relaxed text-white/75">
            Request a quote for a similar {project.category.toLowerCase()} project in Sydney.
          </p>
          <Link href="/#contact" className="btn-primary mt-6 w-full justify-center">
            Get a Quote
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-[3px] border border-white/15 px-5 py-3.5 text-[11px] font-bold tracking-[0.14em] text-white uppercase transition hover:border-ek-teal hover:text-ek-teal"
          >
            <Instagram className="h-4 w-4" aria-hidden />
            @{site.instagram.handle}
          </a>
        </aside>
      </div>

      <div className="border-t border-white/10">
        <div className="landing-container grid gap-4 py-8 sm:grid-cols-2 sm:gap-6">
          <Link
            href={`/gallery/${prev.id}`}
            className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4 transition hover:border-ek-teal/40 hover:bg-white/8 sm:p-5"
          >
            <ArrowLeft className="h-5 w-5 shrink-0 text-ek-teal" aria-hidden />
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-white/50 uppercase">
                Previous
              </p>
              <p className="truncate text-sm font-bold text-white group-hover:text-ek-teal">
                {prev.title}
              </p>
            </div>
          </Link>
          <Link
            href={`/gallery/${next.id}`}
            className="group flex items-center justify-end gap-4 rounded-xl border border-white/10 bg-white/5 p-4 text-right transition hover:border-ek-teal/40 hover:bg-white/8 sm:p-5"
          >
            <div className="min-w-0">
              <p className="text-[10px] font-semibold tracking-[0.2em] text-white/50 uppercase">
                Next
              </p>
              <p className="truncate text-sm font-bold text-white group-hover:text-ek-teal">
                {next.title}
              </p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-ek-teal" aria-hidden />
          </Link>
        </div>
      </div>
    </main>
  );
}
