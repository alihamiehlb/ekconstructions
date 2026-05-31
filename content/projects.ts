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
    src: "https://instagram.fbey33-1.fna.fbcdn.net/v/t51.82787-15/671871649_18087869954240249_306517008682406497_n.jpg?stp=dst-jpg_e35_p1080x1080_sh2.08_tt6&_nc_ht=instagram.fbey33-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2gFsQRUzbraJH94TW5VvGVB0hbISrVImco_mHJcSwZjsi3KODbck9e7RTxuzLYlUAkg&_nc_ohc=4s50RsK5Z3IQ7kNvwHrNOp8&_nc_gid=f6sWLRONodSxgvDKm_q1rQ&edm=AGenrX8BAAAA&ccb=7-5&oh=00_Af4ECxw563pIyOzQean-1xZfnelUFXeqLqJ7sOJSE4RfCA&oe=6A1F8CC5&_nc_sid=ed990e",
    alt: "Frameless glass balustrade installation",
    description: "Frameless glass balustrade with clean aluminium detailing — completed by EK Constructions.",
    featured: true,
    sortOrder: 1,
    objectPosition: "center",
  },
  {
    id: "project-DW3rM9qmE-K",
    title: "Aluminium windows & glazing",
    category: "Aluminium Windows",
    src: "https://instagram.fbey33-1.fna.fbcdn.net/v/t51.82787-15/660798263_18087100034240249_6205771609406692873_n.jpg?stp=dst-jpg_e15_tt6&_nc_ht=instagram.fbey33-1.fna.fbcdn.net&_nc_cat=105&_nc_oc=Q6cZ2gEreFjRsXKObq6kcSEcwaYuiuQ73hRk9WBFGlZ9a436vmyXvSu2_AgQXmrATl2p-GM&_nc_ohc=GkFy_7GWwSgQ7kNvwHXPOiL&_nc_gid=6jwjv6hVatl8UTkM_TgdPw&edm=AGenrX8BAAAA&ccb=7-5&oh=00_Af48cl_8cCRnKxrKSvOk0kbX5UCpHoCFVWWfCElSi3--fA&oe=6A1F9183&_nc_sid=ed990e",
    alt: "Aluminium windows and glazing package",
    description: "Aluminium windows and glazing package for a Sydney residence.",
    featured: true,
    sortOrder: 2,
    objectPosition: "center",
  },
];
