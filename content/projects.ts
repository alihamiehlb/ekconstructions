export type Project = {
  id: string;
  title: string;
  category: string;
  src: string;
  /** Extra gallery slides (Instagram carousels or multi-photo projects). */
  images?: string[];
  alt: string;
  description: string;
  highlights?: string[];
  objectPosition?: string;
  /** Link to original Instagram post when synced from feed. */
  instagramUrl?: string;
};

/** Gallery is populated from synced Instagram CDN URLs — see content/instagram-feed.json */
export const projects: Project[] = [];
