import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ProjectDetailScreen } from "@/components/projects/ProjectDetailScreen";
import { getProjectImages } from "@/lib/project-images";
import { getProjectById, getProjects } from "@/lib/projects";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ id: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) return { title: "Project not found" };
  return {
    title: project.title,
    description: project.description,
    openGraph: { images: [{ url: getProjectImages(project)[0] }] },
  };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const [project, projects] = await Promise.all([getProjectById(id), getProjects()]);

  if (!project) notFound();

  const index = projects.findIndex((p) => p.id === id);

  return (
    <>
      <Header />
      <ProjectDetailScreen project={project} projects={projects} index={index} />
      <Footer />
    </>
  );
}
