"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useReducedMotion } from "framer-motion";
import { useEffect } from "react";

function dispatchScroll() {
  window.dispatchEvent(new Event("scroll"));
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    let lenis: Lenis | null = null;

    const start = () => {
      if (lenis) return;
      document.body.style.overflow = "";

      lenis = new Lenis({
        autoRaf: true,
        autoToggle: true,
        anchors: true,
        allowNestedScroll: true,
        duration: 1.05,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.15,
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
      };
    }

    return () => {
      window.removeEventListener("ek-brand-loader-done", onLoaderDone);
      lenis?.destroy();
    };
  }, [reduceMotion]);

  return <>{children}</>;
}
