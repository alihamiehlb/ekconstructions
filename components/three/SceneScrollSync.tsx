"use client";

import { setSceneScroll } from "@/lib/stores/scene-store";
import { useEffect } from "react";

/** Syncs Lenis/window scroll into the Valtio scene store for parallax in 3D. */
export function SceneScrollSync() {
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSceneScroll(Math.min(y / 800, 1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return null;
}
