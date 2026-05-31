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
  featured?: boolean;
  sortOrder?: number;
};

/** Gallery projects are managed in Admin → Gallery (CMS only). */
export const projects: Project[] = [];
