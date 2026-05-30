"use client";

import { useEffect, useRef, useState } from "react";

const darkSections = new Set(["home", "services", "contact"]);
const sectionIds = ["home", "about", "services", "materials", "contact"] as const;

export function useMobileChrome(pathname: string) {
  const [scrolled, setScrolled] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [headerHidden, setHeaderHidden] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [contactInView, setContactInView] = useState(false);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setScrolled(y > 8);

      if (window.innerWidth < 1024 && pathname === "/") {
        const scrollingDown = y > lastScrollY.current;
        setHeaderHidden(y > 96 && scrollingDown);
        if (y < 72) setHeaderHidden(false);
      } else {
        setHeaderHidden(false);
      }

      lastScrollY.current = y;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection("");
      setContactInView(false);
      return;
    }

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
      { rootMargin: "-38% 0px -52% 0px", threshold: [0.08, 0.2, 0.45] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") return;
    const contact = document.getElementById("contact");
    if (!contact) return;

    const observer = new IntersectionObserver(
      ([entry]) => setContactInView(Boolean(entry?.isIntersecting)),
      { rootMargin: "0px 0px -30% 0px", threshold: 0.1 },
    );

    observer.observe(contact);
    return () => observer.disconnect();
  }, [pathname]);

  const immersiveMobile = pathname === "/" && darkSections.has(activeSection);

  const showQuoteBar =
    pathname === "/" &&
    scrollY > 440 &&
    !contactInView &&
    activeSection !== "home";

  return {
    scrolled,
    headerHidden,
    activeSection,
    immersiveMobile,
    showQuoteBar,
    contactInView,
  };
}
