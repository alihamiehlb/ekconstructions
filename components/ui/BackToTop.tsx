"use client";

import { useMobileChromeState } from "@/components/providers/MobileChromeProvider";
import { ArrowUp } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function BackToTop() {
  const pathname = usePathname();
  const { showQuoteBar } = useMobileChromeState();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const showOnMobile = pathname !== "/" || !showQuoteBar;
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed right-4 bottom-6 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-ek-navy text-white shadow-lg transition hover:bg-ek-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ek-teal sm:right-6 sm:bottom-8 ${
        showOnMobile ? "bottom-6" : "hidden lg:flex lg:bottom-8"
      }`}
      aria-label="Back to top"
    >
      <ArrowUp className="h-5 w-5" strokeWidth={2} aria-hidden />
    </button>
  );
}
