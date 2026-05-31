"use client";

import { HeroVisual } from "@/components/hero/HeroVisual";
import { HeroTrustBar } from "@/components/hero/HeroTrustBar";
import { useSite } from "@/components/providers/SiteProvider";
import { buildWhatsAppChatUrl } from "@/lib/whatsapp";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.884 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

export function Hero() {
  const site = useSite();
  const whatsappUrl = useMemo(
    () => buildWhatsAppChatUrl(site.contact.phone),
    [site.contact.phone],
  );

  return (
    <section
      id="home"
      className="hero-cinematic section-block relative flex flex-col overflow-hidden bg-ek-navy pt-14 lg:pt-[72px]"
    >
      <HeroVisual />

      <div className="landing-container hero-cinematic-inner relative z-10 flex min-h-0 flex-1 flex-col pb-3 lg:justify-between lg:pb-8">
        <div className="hero-content-enter hero-desktop-copy flex max-w-[640px] flex-1 flex-col justify-center pt-3 lg:flex-none lg:pt-10 xl:pt-12">
          <p className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.22em] text-white/90 uppercase">
            <span className="h-3 w-0.5 rounded-full bg-ek-teal" aria-hidden />
            {site.location.area}
          </p>

          <h1 className="hero-mobile-title mt-3 font-black uppercase text-white lg:hidden">
            WE BUILD{" "}
            <span className="text-ek-teal">DETAILS</span>
            {" "}THAT LAST
            <span className="hero-headline-mark" aria-hidden />
          </h1>

          <h1 className="mt-4 hidden font-black leading-[1.02] tracking-tight text-white uppercase lg:block lg:text-[2.35rem] xl:text-[2.75rem]">
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

          <p className="hero-mobile-tagline mt-3 text-white/82 lg:hidden">{site.tagline}</p>
          <p className="mt-4 hidden max-w-[440px] text-[15px] leading-[1.65] text-white/78 lg:block">
            {site.tagline}
          </p>

          <div className="hero-mobile-ctas mt-5 lg:hidden">
            <Link href="#contact" className="hero-btn-primary">
              <span>Get a Quote</span>
              <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
            </Link>
            <Link href="/gallery" className="hero-btn-outline">
              <span>View Our Work</span>
              <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden />
            </Link>
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-btn-whatsapp"
              >
                <WhatsAppIcon className="h-3.5 w-3.5 shrink-0 text-ek-teal" />
                <span>WhatsApp</span>
              </a>
            ) : null}
          </div>

          <div className="hero-desktop-ctas mt-6 hidden flex-wrap items-center gap-3 lg:flex lg:mt-8">
            <Link
              href="#contact"
              className="btn-primary justify-center shadow-lg shadow-ek-teal/25"
            >
              Get a Quote
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center justify-center gap-2 rounded-md border border-white/35 bg-white/5 px-5 py-3.5 text-[11px] font-bold tracking-[0.18em] text-white uppercase backdrop-blur-sm transition hover:border-white/55 hover:bg-white/10"
            >
              View Our Work
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </Link>
            {whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-md border border-ek-teal/40 bg-ek-teal/10 px-5 py-3.5 text-[11px] font-bold tracking-[0.16em] text-white uppercase transition hover:bg-ek-teal/20"
              >
                <WhatsAppIcon className="h-4 w-4 text-ek-teal" />
                WhatsApp
              </a>
            ) : null}
          </div>
        </div>

        <HeroTrustBar className="shrink-0 pt-3 lg:pt-0" variant="hero" />
      </div>
    </section>
  );
}
