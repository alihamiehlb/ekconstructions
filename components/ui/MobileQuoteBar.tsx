"use client";

import { useMobileChromeState } from "@/components/providers/MobileChromeProvider";
import { ArrowRight, ArrowUp } from "lucide-react";
import Link from "next/link";

export function MobileQuoteBar() {
  const { showQuoteBar } = useMobileChromeState();

  if (!showQuoteBar) return null;

  return (
    <div className="mobile-chrome-bar fixed inset-x-3 bottom-3 z-30 flex items-center gap-2 lg:hidden">
      <Link
        href="#contact"
        className="btn-primary mobile-chrome-quote flex min-h-11 flex-1 items-center justify-center gap-2 shadow-lg shadow-ek-teal/25"
      >
        Get a Quote
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="mobile-chrome-top flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/15 bg-ek-navy/90 text-white backdrop-blur-md transition hover:border-white/30 hover:bg-ek-navy"
        aria-label="Back to top"
      >
        <ArrowUp className="h-4 w-4" strokeWidth={2.25} aria-hidden />
      </button>
    </div>
  );
}
