"use client";

import { buildSiteContext, type SiteContextValue } from "@/lib/cms/public-site";
import { getDefaultCms } from "@/lib/cms/defaults";
import type { CmsData } from "@/lib/cms/types";
import { createContext, useContext } from "react";

const SiteContext = createContext<SiteContextValue>(buildSiteContext(getDefaultCms()));

export function SiteProvider({
  cms,
  children,
}: {
  cms: CmsData;
  children: React.ReactNode;
}) {
  return (
    <SiteContext.Provider value={buildSiteContext(cms)}>{children}</SiteContext.Provider>
  );
}

export function useSite() {
  return useContext(SiteContext);
}

export function useCmsSnapshot() {
  return useContext(SiteContext);
}
