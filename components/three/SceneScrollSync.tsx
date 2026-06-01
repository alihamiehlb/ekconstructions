"use client";

import { setSceneScroll } from "@/lib/stores/scene-store";
import { useEffect } from "react";

export function SceneScrollSync() {
  useEffect(() => {
    const onScroll = () => setSceneScroll(Math.min(window.scrollY / 700, 1));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return null;
}
