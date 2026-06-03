"use client";

import { ProjectImage } from "@/components/gallery/ProjectImage";
import { getProjectImages } from "@/lib/project-images";
import type { Project } from "@/content/projects";
import { useEffect, useRef, useState } from "react";

type Props = {
  project: Project;
  index: number;
  compact?: boolean;
  featured?: boolean;
};

export function GalleryCardPreview({ project, index, compact, featured }: Props) {
  const images = getProjectImages(project);
  const [slide, setSlide] = useState(0);
  const [inView, setInView] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const multi = images.length > 1;

  useEffect(() => {
    const el = rootRef.current;
    if (!el || !multi) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(Boolean(entry?.isIntersecting)),
      { rootMargin: "80px", threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [multi]);

  useEffect(() => {
    if (!multi || !inView) return;
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % images.length);
    }, 5000);
    return () => window.clearInterval(id);
  }, [multi, inView, images.length]);

  const src = multi ? images[slide] : images[0];

  return (
    <div
      ref={rootRef}
      className={`gallery-card-media relative w-full overflow-hidden rounded-xl bg-ek-gray ${
        featured && !compact
          ? "aspect-[16/10] sm:aspect-[2/1]"
          : compact
            ? "aspect-[4/3]"
            : "aspect-[4/3] sm:aspect-[5/4]"
      }`}
    >
      <ProjectImage
        src={src}
        projectId={project.id}
        alt={project.alt}
        fill
        sizes={
          compact
            ? "(max-width: 768px) 50vw, 20vw"
            : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        }
        className="object-cover"
        style={{ objectPosition: project.objectPosition ?? "center" }}
        loading={index < 4 ? "eager" : "lazy"}
        quality={85}
      />

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ek-navy/50 via-transparent to-transparent"
        aria-hidden
      />

      {multi ? (
        <span className="absolute bottom-2.5 left-2.5 z-10 rounded-full bg-ek-navy/85 px-2.5 py-1 text-[9px] font-bold tracking-wider text-white uppercase">
          {images.length} photos
        </span>
      ) : null}
    </div>
  );
}
