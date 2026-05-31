"use client";

import { ProjectImage } from "@/components/gallery/ProjectImage";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Props = {
  images: string[];
  alt: string;
  objectPosition?: string;
  className?: string;
  autoPlayMs?: number;
  priority?: boolean;
  variant?: "hero" | "inline";
};

export function ImageCarousel({
  images,
  alt,
  objectPosition = "center",
  className = "",
  autoPlayMs = 5500,
  priority = false,
  variant = "hero",
}: Props) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const count = images.length;
  const hasMany = count > 1;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (!hasMany || reduceMotion || autoPlayMs <= 0) return;
    const id = window.setInterval(() => go(1), autoPlayMs);
    return () => window.clearInterval(id);
  }, [hasMany, reduceMotion, autoPlayMs, go]);

  const heightClass =
    variant === "hero"
      ? "min-h-[52vh] lg:min-h-[68vh]"
      : "aspect-[16/10] min-h-[240px] sm:min-h-[320px]";

  return (
    <div className={`relative overflow-hidden ${heightClass} ${className}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={images[index]}
          className="absolute inset-0"
          initial={reduceMotion ? false : { opacity: 0, scale: 1.06, filter: "blur(8px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={reduceMotion ? undefined : { opacity: 0, scale: 0.98, filter: "blur(4px)" }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <ProjectImage
            src={images[index]}
            alt={`${alt} — slide ${index + 1} of ${count}`}
            fill
            priority={priority && index === 0}
            quality={92}
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition }}
          />
        </motion.div>
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ek-navy via-ek-navy/40 to-ek-navy/10" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-ek-navy/45 to-transparent" />

      {hasMany && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            className="carousel-nav-btn absolute top-1/2 left-3 z-10 -translate-y-1/2 sm:left-5"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="carousel-nav-btn absolute top-1/2 right-3 z-10 -translate-y-1/2 sm:right-5"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" aria-hidden />
          </button>

          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 gap-2 sm:bottom-6">
            {images.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`carousel-dot h-2 rounded-full transition-all duration-300 ${
                  i === index ? "w-8 bg-ek-teal" : "w-2 bg-white/45 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
              />
            ))}
          </div>

          <motion.span
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 right-4 z-10 rounded-full border border-white/20 bg-black/35 px-3 py-1 text-[10px] font-semibold tracking-widest text-white uppercase backdrop-blur-md"
          >
            {index + 1} / {count}
          </motion.span>
        </>
      )}
    </div>
  );
}
