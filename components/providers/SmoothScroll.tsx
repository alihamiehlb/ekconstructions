"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

function dispatchScroll() {
  window.dispatchEvent(new Event("scroll"));
}

function isAdminPath(pathname: string | null): boolean {
  return Boolean(pathname?.startsWith("/admin"));
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();
  const adminRoute = isAdminPath(pathname);

  useEffect(() => {
    if (adminRoute) {
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      document.body.style.overflow = "";
      return;
    }

    if (reduceMotion) return;

    let lenis: Lenis | null = null;

    const start = () => {
      if (lenis || isAdminPath(window.location.pathname)) return;
      document.body.style.overflow = "";

      lenis = new Lenis({
        autoRaf: true,
        autoToggle: true,
        anchors: true,
        allowNestedScroll: true,
        duration: 0.95,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.9,
        touchMultiplier: 1.05,
      });

      lenis.on("scroll", dispatchScroll);
    };

    const onLoaderDone = () => start();

    if (document.body.style.overflow !== "hidden") {
      start();
    } else {
      window.addEventListener("ek-brand-loader-done", onLoaderDone, { once: true });
      const fallback = window.setTimeout(start, 4000);

      return () => {
        window.clearTimeout(fallback);
        window.removeEventListener("ek-brand-loader-done", onLoaderDone);
        lenis?.destroy();
        lenis = null;
      };
    }

    return () => {
      window.removeEventListener("ek-brand-loader-done", onLoaderDone);
      lenis?.destroy();
      lenis = null;
    };
  }, [reduceMotion, adminRoute, pathname]);

  return <>{children}</>;
}
