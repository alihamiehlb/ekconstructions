/** Stored on each project — not including the filter-only "All" option. */
export const PROJECT_CATEGORIES = [
  "Glass Balustrade",
  "Aluminium Windows",
  "Privacy Screens",
  "Steel Work",
  "Recent Work",
] as const;

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number];

export const DEFAULT_PROJECT_CATEGORY: ProjectCategory = "Recent Work";

const LEGACY_CATEGORY_MAP: Record<string, ProjectCategory> = {
  Carpentry: "Recent Work",
};

/** Map stored category strings to a valid project category. */
export function normalizeProjectCategory(value: string): ProjectCategory {
  if (isProjectCategory(value)) return value;
  return LEGACY_CATEGORY_MAP[value] ?? DEFAULT_PROJECT_CATEGORY;
}

export function isProjectCategory(value: string): value is ProjectCategory {
  return (PROJECT_CATEGORIES as readonly string[]).includes(value);
}

/** Categories used in gallery filter UI (includes "All"). */
export const GALLERY_FILTER_CATEGORIES = ["All", ...PROJECT_CATEGORIES] as const;
