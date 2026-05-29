import { projects as defaultProjects, type Project } from "@/content/projects";
import { getCmsProjects } from "@/lib/cms";
import { inferCategoryFromCaption, titleFromCaption } from "@/lib/instagram/categories";
import { readInstagramFeed } from "@/lib/instagram/feed";
import { getInstagramPostMeta } from "@/lib/instagram/post-meta";
import type { InstagramPost } from "@/lib/instagram/types";

export type { Project };

const PLACEHOLDER_PREFIX = "/images/gallery/";

function isPlaceholderProject(project: Project): boolean {
  if (project.src.startsWith(PLACEHOLDER_PREFIX)) return true;
  return (project.images ?? []).some((src) => src.startsWith(PLACEHOLDER_PREFIX));
}

function isRemoteImage(src: string): boolean {
  return src.startsWith("http://") || src.startsWith("https://");
}

function instagramPostToProject(post: InstagramPost): Project {
  const caption = post.caption || "";
  const meta = getInstagramPostMeta(post.shortcode);

  return {
    id: `ig-${post.shortcode}`,
    title: meta?.title ?? titleFromCaption(caption),
    category: meta?.category ?? inferCategoryFromCaption(caption),
    src: post.thumbnail,
    images: post.images,
    alt: caption.slice(0, 120) || "EK Constructions project on Instagram",
    description:
      caption ||
      "Completed work by EK Constructions — see more on our Instagram.",
    instagramUrl: post.permalink,
    highlights: post.isCarousel ? [`${post.images.length} photos`] : undefined,
    objectPosition: "center",
  };
}

async function projectsFromInstagramFeed(): Promise<Project[]> {
  const feed = await readInstagramFeed();
  return feed.posts
    .filter((p) => p.images.length > 0 && isRemoteImage(p.thumbnail))
    .map(instagramPostToProject);
}

export async function getProjects(): Promise<Project[]> {
  const fromIg = await projectsFromInstagramFeed();

  const cmsProjects = (await getCmsProjects()).filter((p) => !isPlaceholderProject(p));

  if (fromIg.length > 0) {
    const igIds = new Set(fromIg.map((p) => p.id));
    const extraCms = cmsProjects.filter(
      (p) => !p.id.startsWith("ig-") && !igIds.has(p.id) && isRemoteImage(p.src),
    );
    return [...fromIg, ...extraCms];
  }

  if (cmsProjects.length > 0) {
    return cmsProjects.filter((p) => isRemoteImage(p.src));
  }

  return defaultProjects.filter((p) => isRemoteImage(p.src));
}

export async function getProjectById(id: string): Promise<Project | undefined> {
  const projects = await getProjects();
  return projects.find((p) => p.id === id);
}

export async function getInstagramPostsForHome() {
  const feed = await readInstagramFeed();
  return feed.posts.filter((p) => p.images.length > 0).slice(0, 8);
}
