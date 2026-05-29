"use client";

import { useEffect } from "react";

/** Native scroll for admin — Lenis is disabled on /admin routes. */
export function AdminScrollFix() {
  useEffect(() => {
    document.documentElement.dataset.admin = "true";
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
    document.documentElement.style.overflow = "auto";
    document.documentElement.style.height = "auto";

    return () => {
      delete document.documentElement.dataset.admin;
      document.body.style.overflow = "";
      document.body.style.height = "";
      document.documentElement.style.overflow = "";
      document.documentElement.style.height = "";
    };
  }, []);

  return null;
}
