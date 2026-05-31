import type { ProjectCategory } from "@/lib/project-categories";

export type Project = {
  id: string;
  title: string;
  category: ProjectCategory | string;
  src: string;
  /** Extra gallery slides for multi-photo projects. */
  images?: string[];
  alt: string;
  description: string;
  highlights?: string[];
  objectPosition?: string;
  /** Show in homepage Featured Spotlight bento grid. */
  featured?: boolean;
  /** Lower numbers appear first in gallery. */
  sortOrder?: number;
};

/** Default gallery projects — overridden by CMS when saved in Admin → Gallery. */
export const projects: Project[] = [
  {
    id: "project-DXJsOgwDysY",
    title: "Frameless glass balustrade",
    category: "Glass Balustrade",
    src: "/images/gallery/glass-balustrade-pool.jpg",
    images: [
      "/images/gallery/glass-balustrade-pool.jpg",
      "/images/gallery/aluminium-windows.jpg",
    ],
    alt: "Frameless glass balustrade around a pool deck",
    description:
      "Frameless glass balustrade with clean aluminium detailing — pool-side safety with uninterrupted views across Sydney.",
    highlights: ["Frameless glass", "Pool compliant", "Aluminium handrail"],
    featured: true,
    sortOrder: 1,
    objectPosition: "58% center",
  },
  {
    id: "project-DW3rM9qmE-K",
    title: "Aluminium windows & glazing",
    category: "Aluminium Windows",
    src: "/images/gallery/aluminium-windows.jpg",
    alt: "Aluminium windows and glazing package on a Sydney residence",
    description:
      "Full aluminium window and glazing package — thermally broken frames, crisp sightlines and premium hardware.",
    highlights: ["Thermally broken", "Double glazing", "Custom sizing"],
    featured: true,
    sortOrder: 2,
    objectPosition: "center",
  },
  {
    id: "project-privacy-screen-01",
    title: "Architectural privacy screen",
    category: "Privacy Screens",
    src: "/images/gallery/privacy-screen.jpg",
    alt: "Custom aluminium privacy screen installation",
    description:
      "Powder-coated aluminium privacy screening — engineered for airflow, durability and a refined street presence.",
    highlights: ["Powder coated", "Custom perforation", "Coastal rated"],
    sortOrder: 3,
    objectPosition: "center",
  },
  {
    id: "project-steel-structure-01",
    title: "Structural steel & balustrade",
    category: "Steel Work",
    src: "/images/gallery/steel-structure.png",
    alt: "Structural steel and balustrade fabrication",
    description:
      "Structural steel fabrication and install — precision welding, galvanised finishes and integrated balustrade systems.",
    highlights: ["Site measure", "Welded steel", "Galvanised finish"],
    sortOrder: 4,
    objectPosition: "center top",
  },
  {
    id: "project-carpentry-01",
    title: "Custom carpentry & joinery",
    category: "Carpentry",
    src: "/images/gallery/carpentry-detail.jpg",
    alt: "Custom carpentry and joinery detail",
    description:
      "Bespoke carpentry and joinery — clean detailing, durable finishes and seamless integration with glazing packages.",
    highlights: ["Custom joinery", "Interior & exterior", "Premium finishes"],
    sortOrder: 5,
    objectPosition: "center 52%",
  },
];
