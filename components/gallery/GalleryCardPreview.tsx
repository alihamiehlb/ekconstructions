"use client";

import { getProjectImages } from "@/lib/project-images";
import type { Project } from "@/content/projects";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
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
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(multi ? images[slide] : images[0]);
  }, [multi, images, slide]);

  return (
    <div
      className={`relative w-full overflow-hidden rounded-xl bg-ek-gray ${
        compact ? "aspect-[4/3]" : "aspect-[4/3] sm:aspect-[5/4]"
      }`}
    >
      <motion.div
        key={imgSrc}
        className="absolute inset-0"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={imgSrc}
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
          unoptimized={imgSrc.startsWith("http")}
        />
      </motion.div>

      {multi && (
        <span className="absolute bottom-2 left-2 z-10 rounded-full bg-ek-navy/75 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white uppercase backdrop-blur-sm">
          {images.length} photos
        </span>
      )}
    </div>
  );
}
