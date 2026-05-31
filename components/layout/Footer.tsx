"use client";

import { legalLinks } from "@/content/legal";
import { navLinks } from "@/content/site";
import { useSite } from "@/components/providers/SiteProvider";
import Link from "next/link";

export function Footer() {
  const site = useSite();
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer py-12 sm:py-14">
      <div className="landing-container grid gap-10 md:grid-cols-[1.2fr_1fr_1fr] md:gap-8">
        <div>
          <p className="text-lg font-black tracking-[0.08em] text-white uppercase">EK Constructions</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/65">
            Aluminium glazing, glass balustrades, steel work & privacy solutions — Sydney, NSW.
          </p>
          <p className="mt-4 text-xs text-white/45">ABN {site.business.abn}</p>
        </div>

        <nav aria-label="Site">
          <p className="section-eyebrow section-eyebrow--dark text-[9px]">Explore</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-semibold tracking-wide text-white/70 uppercase transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <p className="section-eyebrow section-eyebrow--dark text-[9px]">Legal</p>
          <ul className="mt-4 flex flex-col gap-2.5">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-semibold tracking-wide text-white/70 uppercase transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="landing-container mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-center text-xs text-white/45 sm:flex-row sm:text-left">
        <p>
          © {year} {site.name}. All rights reserved.
        </p>
        <p>
          <a href="/llms.txt" className="transition hover:text-white">
            llms.txt
          </a>
          {" · "}
          <a href="/privacy" className="transition hover:text-white">
            Privacy
          </a>
        </p>
      </div>
    </footer>
  );
}
