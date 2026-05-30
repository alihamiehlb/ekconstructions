import type { CmsBeforeAfterItem, CmsBeforeAfterSection } from "@/lib/cms/types";

export const defaultBeforeAfterSection: CmsBeforeAfterSection = {
  eyebrow: "Real transformations",
  title: "Before & After",
  subtitle: "Drag the slider to see the difference our work makes on real Sydney projects.",
};

export const defaultBeforeAfterItems: CmsBeforeAfterItem[] = [
  {
    id: "pool-residence-glazing",
    title: "Pool Residence — Full Glazing Package",
    location: "Greater Sydney, NSW",
    beforeSrc: "/images/before-after-before.jpg",
    afterSrc: "/images/before-after-after.jpg",
    beforeAlt: "Home under construction before windows, balustrades and pool fencing",
    afterAlt: "Completed residence with aluminium windows, glass balustrades and pool fencing",
  },
];
