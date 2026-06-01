"use client";

import { HeroVisual } from "@/components/hero/HeroVisual";
import { HeroTrustBar } from "@/components/hero/HeroTrustBar";
import { useSite } from "@/components/providers/SiteProvider";
import { buildWhatsAppChatUrl } from "@/lib/whatsapp";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

function stripTrailingPeriod(text: string | undefined) {
  if (!text) return "";
  return text.replace(/\.\s*$/, "");
}

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
  const accent = stripTrailingPeriod(site.headlineAccent);

  return (
    <section
      id="home"
      className="hero-pro section-block scroll-mt-20 lg:scroll-mt-[5.5rem]"
      aria-labelledby="hero-heading"
    >
      <div className="hero-pro-grid">
        <div className="hero-pro-panel">
          <div className="landing-container hero-pro-panel-inner">
            <p className="section-eyebrow section-eyebrow--dark">{site.location.area}</p>
            <h1 id="hero-heading" className="hero-pro-heading">
              {site.headline}
              {accent ? <span className="hero-pro-accent">{accent}</span> : null}
            </h1>
            <p className="hero-pro-lead">{site.tagline}</p>
            <div className="hero-pro-actions">
              <Link href="#contact" className="btn-primary hero-pro-cta-primary">
                Get a Quote
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/gallery" className="hero-pro-cta-secondary">
                View Our Work
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hero-pro-cta-secondary hero-pro-cta-whatsapp"
                >
                  <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
                  WhatsApp
                </a>
              ) : null}
            </div>
            <HeroTrustBar className="mt-8" variant="hero" />
          </div>
        </div>
        <div className="hero-pro-visual">
          <HeroVisual />
        </div>
      </div>
    </section>
  );
}
