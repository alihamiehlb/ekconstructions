"use client";

import { useSite } from "@/components/providers/SiteProvider";
import { HeroFloatingScene, HeroMobileAccent } from "@/components/hero/HeroFloatingScene";
import { HeroVisual } from "@/components/hero/HeroVisual";
import { buildWhatsAppChatUrl, displayPhone } from "@/lib/whatsapp";
import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
                {site.location.area} · Sydney
              </p>

              <p className="mt-3 max-w-[400px] text-sm leading-[1.65] text-ek-muted sm:mt-5 sm:text-[15px]">
                {site.tagline}
              </p>

              <div className="relative z-20 mt-5 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
                <Link href="#contact" className="btn-primary w-full justify-center sm:w-auto">
                  Get a Quote
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-play w-full justify-center sm:w-auto"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ek-teal/35 bg-ek-teal/10 text-ek-teal">
                      <WhatsAppIcon className="h-4 w-4" />
                    </span>
                    <span className="text-left leading-tight">
                      <span className="block">Chat on WhatsApp</span>
                      {phoneDisplay ? (
                        <span className="mt-0.5 block text-[10px] font-semibold tracking-wide text-ek-muted normal-case">
                          {phoneDisplay}
                        </span>
                      ) : null}
                    </span>
                  </a>
                ) : null}
              </div>
            </motion.div>

            <div className="relative -mt-1 min-h-0 sm:mt-0 lg:min-h-[420px] xl:min-h-[460px] lg:-mr-[max(0px,calc((100vw-1140px)/2+1.5rem))]">
              <div className="hero-dot-grid pointer-events-none absolute top-0 right-2 z-10 hidden h-16 w-16 opacity-70 sm:block sm:right-4 sm:h-20 sm:w-20 lg:top-2 lg:right-6" />
              <HeroVisual scrollProgress={scrollProgress} />
            </div>
          </div>

          <div className="mt-2 flex justify-center sm:mt-4 lg:hidden">
            <HeroMobileAccent scrollProgress={scrollProgress} />
          </div>
        </div>
      </section>
    </>
  );
}
