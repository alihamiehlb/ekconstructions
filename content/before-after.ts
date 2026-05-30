import type { CmsBeforeAfterItem, CmsBeforeAfterSection } from "@/lib/cms/types";

export const defaultBeforeAfterSection: CmsBeforeAfterSection = {
  eyebrow: "Real transformations",
  title: "Before & After",
  subtitle: "Drag the slider to compare our work — upload your own pairs in Admin.",
};

export const defaultBeforeAfterItems: CmsBeforeAfterItem[] = [
  {
    id: "balustrade-upgrade",
    title: "Frameless Glass Balustrade",
    location: "North Ryde, NSW",
    beforeSrc: "/images/hero-building.png",
    afterSrc: "/images/hero-building.png",
    beforeAlt: "Balustrade area before installation",
    afterAlt: "Completed frameless glass balustrade",
  },
  {
    id: "window-replacement",
    title: "Aluminium Window Upgrade",
    location: "Greater Sydney",
    beforeSrc: "/images/hero-building.png",
    afterSrc: "/images/hero-building.png",
    beforeAlt: "Windows before replacement",
    afterAlt: "New aluminium window system installed",
  },
];
