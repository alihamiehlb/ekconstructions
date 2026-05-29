"use client";

import { legalLinks } from "@/content/legal";
import { navLinks } from "@/content/site";
import { useSite } from "@/components/providers/SiteProvider";
import Link from "next/link";

export function Footer() {
  const site = useSite();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-ek-navy/10 bg-white py-10 sm:py-12">
      <div className="section-pad grid gap-10 md:grid-cols-[1.2fr_1fr_1fr] md:gap-8">
        <div>
          <p className="text-lg font-black text-ek-navy">EK CONSTRUCTIONS</p>
          <p className="mt-2 max-w-xs text-sm leading-relaxed text-ek-muted">
            Aluminium glazing, glass balustrades, steel work & privacy solutions — Sydney, NSW.
          </p>
          <p className="mt-3 text-xs text-ek-muted">ABN {site.business.abn}</p>
        </div>

        <nav aria-label="Site">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-ek-teal uppercase">Explore</p>
          <ul className="mt-3 flex flex-col gap-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-semibold tracking-wide text-ek-navy/70 uppercase transition hover:text-ek-teal"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <p className="text-[10px] font-semibold tracking-[0.25em] text-ek-teal uppercase">Legal</p>
          <ul className="mt-3 flex flex-col gap-2">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-xs font-semibold tracking-wide text-ek-navy/70 uppercase transition hover:text-ek-teal"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="section-pad mt-8 flex flex-col items-center justify-between gap-3 border-t border-ek-navy/8 pt-6 text-center text-xs text-ek-muted sm:flex-row sm:text-left">
        <p>© {year} {site.name}. All rights reserved.</p>
        <p>
          <a href="/llms.txt" className="hover:text-ek-teal">
            llms.txt
          </a>
          {" · "}
          <a href="/privacy" className="hover:text-ek-teal">
            Privacy
          </a>
        </p>
      </div>
    </footer>
  );
}
