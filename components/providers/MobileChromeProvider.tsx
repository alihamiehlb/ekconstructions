"use client";

import { useMobileChrome } from "@/lib/hooks/useMobileChrome";
import { usePathname } from "next/navigation";
import { createContext, useContext } from "react";

type MobileChromeState = ReturnType<typeof useMobileChrome>;

const MobileChromeContext = createContext<MobileChromeState | null>(null);

export function MobileChromeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const state = useMobileChrome(pathname);

  return (
    <MobileChromeContext.Provider value={state}>{children}</MobileChromeContext.Provider>
  );
}

export function useMobileChromeState() {
  const ctx = useContext(MobileChromeContext);
  if (!ctx) {
    throw new Error("useMobileChromeState must be used within MobileChromeProvider");
  }
  return ctx;
}
