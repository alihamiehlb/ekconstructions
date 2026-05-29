"use client";

import { Logo } from "@/components/brand/Logo";
import { navLinks } from "@/content/site";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const sectionIds = ["home", "about", "services", "materials", "contact"] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoReady, setLogoReady] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("home");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    if (pathname !== "/") return;

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: [0.1, 0.25, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/gallery") return pathname.startsWith("/gallery");
    if (pathname !== "/") return false;
    const hash = href.split("#")[1];
    return hash ? activeSection === hash : activeSection === "home";
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-sm" : "bg-white"
      }`}
    >
      <div className="flex h-[68px] items-center lg:h-[74px]">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={logoReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex shrink-0 items-center pl-2 sm:pl-4 lg:pl-5 xl:pl-6"
        >
          <Logo />
        </motion.div>

        <div className="relative mx-auto hidden flex-1 lg:block">
          <nav className="flex justify-center" aria-label="Main">
            <ul className="flex items-center gap-7 xl:gap-9">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={`relative text-[10px] font-semibold tracking-[0.24em] uppercase transition-colors ${
                        active ? "text-ek-teal" : "text-ek-navy/65 hover:text-ek-teal"
                      }`}
                    >
                      {link.label}
                      {active && (
                        <span className="absolute -bottom-2 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-ek-teal" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="ml-auto flex items-center pr-4 sm:pr-6 lg:pr-8 xl:pr-10">
          <button
            type="button"
            className="rounded p-2 text-ek-navy lg:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" strokeWidth={1.5} /> : <Menu className="h-6 w-6" strokeWidth={1.5} />}
          </button>
          <div className="hidden w-[140px] lg:block" aria-hidden />
        </div>
      </div>

      {open && (
        <nav className="border-t border-ek-navy/10 bg-white lg:hidden" aria-label="Mobile">
          <ul className="flex flex-col gap-4 px-4 py-5 sm:px-6">
            {navLinks.map((link) => {
              const active = isActive(link.href);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={`text-xs font-semibold tracking-[0.2em] uppercase ${
                      active ? "text-ek-teal" : "text-ek-navy"
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
      )}
    </header>
  );
}
