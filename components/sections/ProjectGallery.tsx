import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import type { Project } from "@/content/projects";

const HOMEPAGE_LIMIT = 4;

function pickHomepageProjects(projects: Project[]): Project[] {
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const ordered = featured.length > 0 ? [...featured, ...rest] : projects;
  return ordered.slice(0, HOMEPAGE_LIMIT);
}

export function ProjectGallery({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null;

  const display = pickHomepageProjects(projects);

  return (
    <GalleryGrid
      projects={display}
      totalCount={projects.length}
      showAllLink={projects.length > display.length}
      compact
      title="Recent Projects"
      subtitle="Gallery"
      description="A selection of recent aluminium, glass, and steel work across Sydney."
    />
  );
}
