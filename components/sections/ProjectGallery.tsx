import type { Project } from "@/content/projects";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";

export function ProjectGallery({ projects }: { projects: Project[] }) {
  return (
    <GalleryGrid
      projects={projects}
      showAllLink
      compact
      title="Recent Projects"
      subtitle="Gallery"
    />
  );
}
