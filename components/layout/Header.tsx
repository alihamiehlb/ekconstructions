"use client";

import { Logo } from "@/components/brand/Logo";
import { navLinks } from "@/content/site";
import { useMobileChromeState } from "@/components/providers/MobileChromeProvider";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const { scrolled, headerHidden, activeSection, immersiveMobile } = useMobileChromeState();

  useEffect(() => {
    const reveal = () => setLogoReady(true);
    window.addEventListener("ek-brand-loader-done", reveal);
    const fallback = window.setTimeout(reveal, 3200);
    return () => {
      window.removeEventListener("ek-brand-loader-done", reveal);
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
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

  const heroOverlay = pathname === "/" && !scrolled;
  const mobileDark = immersiveMobile;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-[transform,background-color,border-color,box-shadow] duration-300 ${
        headerHidden ? "-translate-y-full lg:translate-y-0" : "translate-y-0"
      } ${
        mobileDark
          ? "border-white/10 bg-ek-navy/45 backdrop-blur-md lg:border-ek-navy/10 lg:bg-white/95 lg:shadow-sm"
          : scrolled
            ? "border-ek-navy/10 bg-white/95 shadow-sm backdrop-blur-md"
            : "border-transparent bg-white"
      } ${heroOverlay ? "lg:border-transparent lg:bg-white" : ""}`}
    >
      <div className="landing-container flex h-14 items-center justify-between gap-2 sm:gap-4 lg:h-[72px]">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={logoReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="min-w-0 shrink-0"
        >
          <Logo
            variant={mobileDark ? "dark" : "light"}
            size="headerCompact"
            className="lg:hidden"
          />
          <Logo variant="light" size="header" className="hidden lg:inline-flex" />
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
                    className={`relative whitespace-nowrap px-1 py-2 text-[10px] font-semibold tracking-[0.22em] uppercase transition-colors xl:text-[11px] xl:tracking-[0.24em] ${
                      active ? "text-ek-teal" : "text-ek-navy/65 hover:text-ek-teal"
                    }`}
                  >
                    {link.label}
                    {active && (
                      <span className="absolute -bottom-0.5 left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-ek-teal" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href={quoteHref()}
            className="btn-primary inline-flex px-2.5 py-1.5 text-[8px] tracking-[0.12em] sm:px-3 sm:py-2 sm:text-[9px] lg:px-4 lg:py-2.5 lg:text-[10px] lg:tracking-[0.16em] xl:px-5"
            onClick={() => setOpen(false)}
          >
            Get Quote
            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" aria-hidden />
          </Link>

          <button
            type="button"
            className={`inline-flex h-9 w-9 items-center justify-center rounded-md border transition lg:hidden ${
              mobileDark || open
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
              className="fixed inset-0 top-14 z-40 bg-ek-navy/55 backdrop-blur-[2px] lg:hidden"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            />

            <motion.nav
              id="mobile-nav"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className={`absolute inset-x-0 top-full z-50 max-h-[calc(100dvh-3.5rem)] overflow-y-auto border-t shadow-lg lg:hidden ${
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
                        className={`flex items-center rounded-lg px-3 py-3 text-xs font-semibold tracking-[0.18em] uppercase transition ${
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
