"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export function MobileQuoteBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 420);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ek-navy/10 bg-white/95 p-3 shadow-[0_-8px_30px_rgba(11,29,38,0.08)] backdrop-blur-md lg:hidden">
      <Link
        href="#contact"
        className="btn-primary flex w-full justify-center shadow-sm"
      >
        Get a Quote
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </div>
  );
}
