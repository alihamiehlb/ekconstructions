"use client";

import { ProjectImage } from "@/components/gallery/ProjectImage";
import { getProjectImages } from "@/lib/project-images";
import type { Project } from "@/content/projects";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

type Props = {
  project: Project;
  index: number;
  compact?: boolean;
};

export function GalleryCardPreview({ project, index, compact }: Props) {
  const images = getProjectImages(project);
  const reduceMotion = useReducedMotion();
  const [slide, setSlide] = useState(0);
  const multi = images.length > 1;

  useEffect(() => {
    if (!multi || reduceMotion) return;
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % images.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, [multi, reduceMotion, images.length]);

  const src = multi ? images[slide] : images[0];

  return (
    <div
      className={`gallery-card-media relative w-full overflow-hidden rounded-xl bg-ek-gray ${
        compact ? "aspect-[4/3]" : "aspect-[4/3] sm:aspect-[5/4]"
      }`}
    >
      <motion.div
        key={`${project.id}-${slide}`}
        className="absolute inset-0"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.04 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
          className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
          style={{ objectPosition: project.objectPosition ?? "center" }}
          loading={index < 4 ? "eager" : "lazy"}
          quality={88}
        />
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ek-navy/55 via-transparent to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />

      {multi && (
        <span className="absolute bottom-2.5 left-2.5 z-10 rounded-full bg-ek-navy/80 px-2.5 py-1 text-[9px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
          {images.length} photos
        </span>
      )}
    </div>
  );
}
