"use client";

import { BeforeAfterCompare } from "@/components/ui/BeforeAfterCompare";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { CmsBeforeAfterItem, CmsBeforeAfterSection } from "@/lib/cms/types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  section: CmsBeforeAfterSection;
  items: CmsBeforeAfterItem[];
};

function isValidItem(item: CmsBeforeAfterItem) {
  return Boolean(item.beforeSrc?.trim() && item.afterSrc?.trim());
}

export function BeforeAfterShowcase({ section, items }: Props) {
  const reduceMotion = useReducedMotion();
  const slides = useMemo(() => items.filter(isValidItem), [items]);
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => (i + dir + count) % count);
    },
    [count],
  );

  useEffect(() => {
    if (count <= 1 || reduceMotion) return;
    const id = window.setInterval(() => go(1), 9000);
    return () => window.clearInterval(id);
  }, [count, reduceMotion, go]);

  if (!count) return null;

  const active = slides[index];

  return (
    <section id="transformations" className="section-block section-block-muted relative overflow-hidden">
      <div className="before-after-bg pointer-events-none absolute inset-0" aria-hidden />

      <div className="landing-container relative">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.subtitle}
          align="center"
        />

        <div className="relative mx-auto mt-10 w-full max-w-4xl lg:mt-12">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active.id}
              className="w-full"
              initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12, scale: 0.99 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <BeforeAfterCompare
                beforeSrc={active.beforeSrc}
                afterSrc={active.afterSrc}
                beforeAlt={active.beforeAlt}
                afterAlt={active.afterAlt}
                title={active.title}
                location={active.location}
                priority={index === 0}
              />
            </motion.div>
          </AnimatePresence>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                className="carousel-nav-btn absolute top-1/2 left-0 z-10 -translate-x-1/2 -translate-y-1/2 sm:left-2 sm:translate-x-0"
                aria-label="Previous transformation"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                className="carousel-nav-btn absolute top-1/2 right-0 z-10 translate-x-1/2 -translate-y-1/2 sm:right-2 sm:translate-x-0"
                aria-label="Next transformation"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {slides.map((slide, i) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`rounded-full px-3 py-1.5 text-[10px] font-semibold tracking-wide uppercase transition ${
                      i === index
                        ? "bg-ek-teal text-white shadow-sm"
                        : "bg-white text-ek-navy ring-1 ring-ek-navy/10 hover:ring-ek-teal/30"
                    }`}
                    aria-current={i === index ? "true" : undefined}
                  >
                    {slide.title}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
