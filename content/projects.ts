export type Project = {
  id: string;
  title: string;
  category: string;
  src: string;
  alt: string;
  description: string;
  highlights?: string[];
  objectPosition?: string;
};

export const projects: Project[] = [
  {
    id: "stairs",
    title: "Frameless stair balustrade",
    category: "Glass Balustrade",
    src: "/images/gallery/gallery-stairs.jpg",
    alt: "Modern interior staircase with glass balustrade",
    objectPosition: "center 40%",
    description:
      "Custom frameless glass balustrade for a floating stair — minimal fixings, clean sightlines, and compliant safety glass throughout.",
    highlights: ["Frameless glass", "Interior stairs", "Sydney residential"],
  },
  {
    id: "hallway",
    title: "Interior glass hallway",
    category: "Glass Balustrade",
    src: "/images/gallery/gallery-hallway.jpg",
    alt: "Interior hallway with glass railings",
    objectPosition: "center center",
    description:
      "Full-height glass balustrade along a light-filled hallway — engineered for strength while keeping spaces open and modern.",
    highlights: ["Void balustrade", "Premium fixings", "Custom measure"],
  },
  {
    id: "exterior",
    title: "Contemporary home exterior",
    category: "Aluminium Windows",
    src: "/images/gallery/gallery-exterior.jpg",
    alt: "Modern house exterior at dusk",
    objectPosition: "center center",
    description:
      "Large-format aluminium windows and glazing for a contemporary facade — maximising natural light with a refined architectural finish.",
    highlights: ["Aluminium glazing", "Double glazed", "Exterior upgrade"],
  },
  {
    id: "privacy",
    title: "Aluminium privacy screen",
    category: "Privacy Screens",
    src: "/images/gallery/gallery-privacy.jpg",
    alt: "Black slatted aluminium privacy gate",
    objectPosition: "center center",
    description:
      "Black aluminium slat privacy screen and gate — durable powder-coated finish with secure access and a sleek contemporary look.",
    highlights: ["Slat screening", "Automated gate ready", "Low maintenance"],
  },
  {
    id: "kitchen",
    title: "Modern interior fit-out",
    category: "Carpentry",
    src: "/images/gallery/gallery-kitchen.jpg",
    alt: "Modern kitchen interior",
    objectPosition: "center center",
    description:
      "Precision carpentry and interior fit-out for a modern kitchen space — clean lines, quality materials, and expert finishing.",
    highlights: ["Custom joinery", "Residential", "Detail finishing"],
  },
];
