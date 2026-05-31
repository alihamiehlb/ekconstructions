import { getDefaultCms } from "@/lib/cms/defaults";
import type { CmsData } from "@/lib/cms/types";
import { normalizeProjectList } from "@/lib/gallery-image";

/** Merge stored CMS with defaults so new fields never break older rows. */
export function mergeCmsWithDefaults(partial: Partial<CmsData>): CmsData {
  const defaults = getDefaultCms();
  return {
    ...defaults,
    ...partial,
    site: { ...defaults.site, ...partial.site },
    services: partial.services?.length ? partial.services : defaults.services,
    whyChooseUs: partial.whyChooseUs?.length ? partial.whyChooseUs : defaults.whyChooseUs,
    materials: partial.materials?.length ? partial.materials : defaults.materials,
    projects:
      partial.projects != null
        ? normalizeProjectList(partial.projects)
        : defaults.projects,
    updatedAt: partial.updatedAt ?? defaults.updatedAt,
  };
}
