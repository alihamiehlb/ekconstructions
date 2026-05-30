"use client";

import { BeforeAfterCompare } from "@/components/ui/BeforeAfterCompare";
import { SectionReveal } from "@/components/ui/SectionReveal";
import type { CmsBeforeAfterItem, CmsBeforeAfterSection } from "@/lib/cms/types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
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
    <section id="transformations" className="relative overflow-hidden bg-ek-gray py-14 md:py-16 lg:py-20">
      <div className="before-after-bg pointer-events-none absolute inset-0" aria-hidden />

      <div className="landing-container relative">
        <SectionReveal>
          <div className="mx-auto max-w-2xl text-center">
            <p className="inline-flex items-center justify-center gap-2 text-[10px] font-semibold tracking-[0.28em] text-ek-teal uppercase">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              {section.eyebrow}
            </p>
            <h2 className="mt-3 text-[1.55rem] font-black tracking-tight text-ek-navy uppercase sm:text-[1.85rem] lg:text-[2.1rem]">
              {section.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ek-muted sm:text-base">
              {section.subtitle}
            </p>
          </div>
        </SectionReveal>

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
