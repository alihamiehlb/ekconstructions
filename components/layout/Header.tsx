"use client";

import { Logo } from "@/components/brand/Logo";
import { navLinks } from "@/content/site";
import { useMobileChromeState } from "@/components/providers/MobileChromeProvider";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const { scrolled, headerHidden, activeSection, immersiveMobile } = useMobileChromeState();

  useEffect(() => {
    const reveal = () => setLogoReady(true);
    window.addEventListener("ek-brand-loader-done", reveal);
    const fallback = window.setTimeout(reveal, 1600);
    return () => {
      window.removeEventListener("ek-brand-loader-done", reveal);
      window.clearTimeout(fallback);
    };
  }, []);

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

  const onHomeHero = pathname === "/" && !scrolled;
  const mobileDark = immersiveMobile;
  const headerTone =
    onHomeHero || mobileDark
      ? "dark"
      : scrolled || pathname !== "/"
        ? "light"
        : "dark";

  return (
    <header
      data-header-tone={headerTone}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[transform,background-color,border-color,box-shadow] duration-300 ${
        headerHidden ? "-translate-y-full lg:translate-y-0" : "translate-y-0"
      } ${
        onHomeHero
          ? "border-white/10 bg-ek-navy/92 shadow-sm backdrop-blur-md lg:border-ek-navy/10 lg:bg-white/97 lg:shadow-sm"
          : mobileDark
            ? "border-white/10 bg-ek-navy/90 backdrop-blur-md lg:border-ek-navy/10 lg:bg-white/97 lg:shadow-sm"
            : scrolled
              ? "border-ek-navy/10 bg-white/97 shadow-sm backdrop-blur-md"
              : "border-ek-navy/8 bg-white/97 shadow-sm"
      }`}
    >
      <div className="landing-container flex h-[3.75rem] items-center justify-between gap-3 sm:h-16 lg:h-[4.5rem]">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={logoReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0 shrink-0"
        >
          <Logo
            variant="dark"
            className={`logo-header-mobile lg:hidden ${headerTone === "dark" ? "logo-header-mobile--on-dark" : "logo-header-mobile--on-light"}`}
          />
          <Logo variant="light" className="hidden lg:inline-flex" />
        </motion.div>

        <nav className="hidden min-w-0 flex-1 justify-center lg:flex" aria-label="Main">
          <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 xl:gap-x-8">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`nav-link relative whitespace-nowrap px-1 py-2.5 text-[10px] font-semibold tracking-[0.22em] uppercase xl:text-[11px] xl:tracking-[0.24em] ${
                      active ? "nav-link-active text-ek-teal" : "text-ek-navy/65 hover:text-ek-teal"
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
            className="btn-primary inline-flex min-h-10 px-3 py-2 text-[10px] tracking-[0.14em] sm:min-h-11 sm:px-4 sm:text-[10px] lg:px-5 lg:tracking-[0.16em]"
            onClick={() => setOpen(false)}
          >
            Get Quote
            <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden />
          </Link>

          <button
            ref={menuButtonRef}
            type="button"
            className={`inline-flex h-11 w-11 items-center justify-center rounded-md border transition lg:hidden ${
              headerTone === "dark" || open
                ? "border-white/25 bg-white text-ek-navy hover:bg-white/90"
                : "border-ek-navy/10 text-ek-navy hover:border-ek-teal/30 hover:bg-ek-gray"
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

      <AnimatePresence>
        {open && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-[3.75rem] z-40 bg-ek-navy/55 backdrop-blur-[2px] sm:top-16 lg:hidden"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />

            <motion.nav
              id="mobile-nav"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className={`absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-3.75rem)] overflow-y-auto border-t shadow-lg sm:max-h-[calc(100dvh-4rem)] lg:hidden ${
                mobileDark
                  ? "border-white/10 bg-ek-navy/95 backdrop-blur-md"
                  : "border-ek-navy/10 bg-white"
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
                        className={`flex min-h-[44px] items-center rounded-lg px-3 py-3 text-xs font-semibold tracking-[0.18em] uppercase transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ek-teal ${
                          active
                            ? mobileDark
                              ? "bg-ek-teal/15 text-ek-teal"
                              : "bg-ek-teal/8 text-ek-teal"
                            : mobileDark
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
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
