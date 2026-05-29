import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { getProjects } from "@/lib/projects";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Project Gallery",
  description: "Explore aluminium, glass balustrade, steel, privacy screen and carpentry projects by EK Constructions across Sydney.",
};

export default async function GalleryPage() {
  const projects = await getProjects();

  return (
    <>
      <Header />
      <main id="main-content" className="bg-white pt-[68px] lg:pt-[74px]">
        <div className="landing-container py-10 md:py-14">
          <p className="text-[10px] font-semibold tracking-[0.35em] text-ek-teal uppercase">
            Our Work
          </p>
          <h1 className="mt-2 max-w-2xl text-2xl font-black tracking-tight text-ek-navy uppercase sm:text-3xl md:text-4xl">
            Project Gallery
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-ek-muted sm:text-base">
            Browse completed aluminium glazing, frameless glass balustrades, privacy screens, steel
            work and carpentry across Sydney and Greater NSW.
          </p>
        </div>
        <GalleryGrid
          projects={projects}
          title="All Projects"
          subtitle="Showcase"
        />
      </main>
      <Footer />
    </>
  );
}
