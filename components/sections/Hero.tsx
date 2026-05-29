"use client";

import { useSite } from "@/components/providers/SiteProvider";
import { HeroFloatingScene } from "@/components/hero/HeroFloatingScene";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { InstagramVideoModal } from "@/components/hero/InstagramVideoModal";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Link from "next/link";
import { useRef, useState } from "react";

export function Hero() {
  const site = useSite();
  const [videoOpen, setVideoOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const [scrollProgress, setScrollProgress] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => setScrollProgress(v));

  return (
    <>
      <section
        ref={sectionRef}
        id="home"
        className="relative overflow-hidden bg-white pt-[68px] lg:pt-[74px]"
      >
        <div className="landing-container relative pb-4 sm:pb-8 lg:pb-10">
          <HeroFloatingScene scrollProgress={scrollProgress} />

          <div className="grid items-start gap-3 sm:gap-5 lg:grid-cols-[minmax(0,42%)_minmax(0,58%)] lg:gap-6 xl:gap-8">
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10 max-w-[500px] pt-4 sm:pt-8 lg:pt-10 xl:pt-12"
            >
              <h1 className="template-hero-title text-[1.45rem] font-black text-ek-navy uppercase sm:text-[2rem] md:text-[2.2rem] lg:text-[2.55rem] xl:text-[2.75rem]">
                {site.headline}
                <br />
                <span className="text-ek-teal">{site.headlineAccent}</span>
              </h1>

              <p className="mt-3 inline-flex w-fit items-center gap-2 rounded-full border border-ek-teal/25 bg-ek-teal/8 px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-ek-teal uppercase">
                {site.business.yearsExperience} years experience · Sydney
              </p>

              <p className="mt-3 max-w-[400px] text-sm leading-[1.65] text-ek-muted sm:mt-5 sm:text-[15px]">
                {site.tagline}
              </p>

              <div className="relative z-20 mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                <Link href="#contact" className="btn-primary w-full justify-center sm:w-auto">
                  Get a Quote
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <button
                  type="button"
                  onClick={() => setVideoOpen(true)}
                  className="btn-play w-full justify-center sm:w-auto"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-ek-navy/25">
                    <Play className="ml-0.5 h-3.5 w-3.5 fill-current" aria-hidden />
                  </span>
                  Play Video
                </button>
              </div>
            </motion.div>

            <div className="relative -mt-1 min-h-0 sm:mt-0 lg:min-h-[420px] xl:min-h-[460px] lg:-mr-[max(0px,calc((100vw-1140px)/2+1.5rem))]">
              <div className="hero-dot-grid pointer-events-none absolute top-0 right-2 z-10 hidden h-16 w-16 opacity-70 sm:block sm:right-4 sm:h-20 sm:w-20 lg:top-2 lg:right-6" />
              <HeroVisual scrollProgress={scrollProgress} />
            </div>
          </div>
        </div>
      </section>

      <InstagramVideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </>
  );
}
