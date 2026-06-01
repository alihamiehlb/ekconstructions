"use client";

import { Logo } from "@/components/brand/Logo";
import { navLinks } from "@/content/site";
import { useMobileChromeState } from "@/components/providers/MobileChromeProvider";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { scrolled, headerHidden, activeSection } = useMobileChromeState();
  const onHomeHero = pathname === "/" && !scrolled;

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const panel = document.getElementById("mobile-nav");
    const focusable = panel?.querySelector<HTMLElement>("a, button");
    focusable?.focus();
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/gallery") return pathname.startsWith("/gallery");
    if (pathname !== "/") return false;
    const hash = href.split("#")[1];
    return hash ? activeSection === hash : activeSection === "home";
  }

  function quoteHref() {
    return pathname === "/" ? "#contact" : "/#contact";
  }

  const isDark = onHomeHero;
  const logoVariant = isDark ? "dark" : "light";

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 border-b shadow-sm transition-[transform,background-color,border-color] duration-300 ${
        headerHidden ? "-translate-y-full lg:translate-y-0" : "translate-y-0"
      } ${isDark ? "site-header--glass" : "site-header--solid"}`}
    >
      <div className="landing-container flex h-[3.75rem] items-center justify-between gap-3 sm:h-16 lg:h-[4.5rem]">
        <div className="min-w-0 shrink-0">
          <Logo
            variant={logoVariant}
            className={isDark ? "logo-header-mobile--on-dark" : "logo-header-mobile--on-light"}
          />
        </div>

        <nav className="hidden min-w-0 flex-1 justify-center lg:flex" aria-label="Main">
          <ul className="flex flex-wrap items-center justify-center gap-x-6 xl:gap-x-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`nav-link relative whitespace-nowrap px-1 py-2.5 text-[11px] font-semibold tracking-[0.2em] uppercase ${
                      active
                        ? "nav-link-active text-ek-teal"
                        : isDark
                          ? "text-white/75 hover:text-white"
                          : "text-ek-navy/70 hover:text-ek-navy"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href={quoteHref()}
            className="btn-primary inline-flex min-h-10 px-3 py-2 text-[10px] tracking-[0.14em] sm:min-h-11 sm:px-4 lg:px-5 lg:tracking-[0.16em]"
            onClick={() => setOpen(false)}
          >
            Get Quote
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-md border lg:hidden ${
              isDark || open
                ? "border-white/25 bg-white text-ek-navy hover:bg-white/90"
                : "border-ek-line text-ek-navy hover:border-ek-teal/30 hover:bg-ek-gray"
            }`}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <>
          <button
            type="button"
            className="fixed inset-0 top-[3.75rem] z-40 bg-ek-navy/40 sm:top-16 lg:hidden"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav
            id="mobile-nav"
            className={`absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-3.75rem)] overflow-y-auto border-t shadow-lg sm:max-h-[calc(100dvh-4rem)] lg:hidden ${
              isDark ? "border-white/10 bg-ek-navy/95 backdrop-blur-md" : "border-ek-line bg-white"
            }`}
            aria-label="Mobile"
          >
            <ul className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`flex min-h-[44px] items-center rounded-lg px-3 py-3 text-xs font-semibold tracking-[0.16em] uppercase focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ek-teal ${
                        active
                          ? isDark
                            ? "bg-ek-teal/15 text-ek-teal"
                            : "bg-ek-teal/8 text-ek-teal"
                          : isDark
                            ? "text-white/90 hover:bg-white/8"
                            : "text-ek-navy hover:bg-ek-gray"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      ) : null}
    </header>
  );
}
