"use client";

import { HeroStatsBand } from "@/components/hero/HeroStatsBand";
import { HeroTrustBar } from "@/components/hero/HeroTrustBar";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { useSite } from "@/components/providers/SiteProvider";
import { buildWhatsAppChatUrl, displayPhone } from "@/lib/whatsapp";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function Hero() {
  const site = useSite();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const [scrollProgress, setScrollProgress] = useState(0);
  const whatsappUrl = useMemo(
    () => buildWhatsAppChatUrl(site.contact.phone),
    [site.contact.phone],
  );
  const phoneDisplay = displayPhone(site.contact.phone);

  useMotionValueEvent(scrollYProgress, "change", (v) => setScrollProgress(v));

  return (
    <section
      ref={sectionRef}
      id="home"
      className="hero-cinematic relative overflow-hidden bg-ek-navy pt-16 lg:pt-[72px]"
    >
      <HeroVisual scrollProgress={scrollProgress} />

      <div className="landing-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative max-w-[540px] pb-8 pt-8 sm:pb-10 sm:pt-10 lg:max-w-[580px] lg:pb-14 lg:pt-16 xl:pt-20"
        >
          <p className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] text-white/85 uppercase">
            <span className="h-3 w-0.5 rounded-full bg-ek-teal" aria-hidden />
            {site.location.area}
          </p>

          <h1 className="mt-4 text-[1.65rem] font-black leading-[1.02] tracking-tight text-white uppercase sm:text-[2.15rem] md:text-[2.35rem] lg:text-[2.55rem] xl:text-[2.75rem]">
            {site.headline}
            <br />
            <span className="relative inline-block text-ek-teal">
              {site.headlineAccent}
              <svg
                className="hero-brush-stroke absolute -bottom-1 left-0 w-full"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
                aria-hidden
              >
                <path
                  d="M2 8 C40 2, 80 10, 120 6 S180 4, 198 7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  className="text-ek-teal"
                />
              </svg>
            </span>
          </h1>

          <p className="mt-4 max-w-[420px] text-sm leading-[1.7] text-white/78 sm:mt-5 sm:text-[15px]">
            {site.tagline}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
            <Link
              href="#contact"
              className="btn-primary w-full justify-center shadow-lg shadow-ek-teal/25 sm:w-auto"
            >
              Get a Quote
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/gallery"
              className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-white/35 bg-white/5 px-5 py-3.5 text-[11px] font-bold tracking-[0.18em] text-white uppercase backdrop-blur-sm transition hover:border-white/55 hover:bg-white/10 sm:w-auto"
            >
              View Our Work
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </motion.div>
      </div>

      <HeroTrustBar />

      {whatsappUrl ? (
        <div className="relative z-20 px-4 pb-2 sm:px-6">
          <div className="landing-container">
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.5 }}
              className="hero-whatsapp-bar mx-auto flex max-w-xl items-center gap-3 rounded-2xl border border-ek-navy/8 bg-white px-4 py-3.5 shadow-[0_12px_40px_rgba(10,10,10,0.12)] sm:gap-4 sm:px-5 sm:py-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ek-teal text-white shadow-sm sm:h-12 sm:w-12">
                <WhatsAppIcon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-bold tracking-[0.2em] text-ek-navy uppercase">
                  Chat on WhatsApp
                </span>
                {phoneDisplay ? (
                  <span className="mt-0.5 block truncate text-sm font-semibold text-ek-muted">
                    {phoneDisplay}
                  </span>
                ) : null}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0 text-ek-teal" aria-hidden />
            </motion.a>
          </div>
        </div>
      ) : null}

      <HeroStatsBand />
    </section>
  );
}
