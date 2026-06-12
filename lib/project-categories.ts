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

export function isProjectCategory(value: string): value is ProjectCategory {
  return (PROJECT_CATEGORIES as readonly string[]).includes(value);
}

/** Categories used in gallery filter UI (includes "All"). */
export const GALLERY_FILTER_CATEGORIES = ["All", ...PROJECT_CATEGORIES] as const;
