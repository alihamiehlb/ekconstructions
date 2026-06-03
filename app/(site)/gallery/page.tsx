import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { readCms } from "@/lib/cms";
import { PROJECT_CATEGORIES } from "@/lib/project-categories";
import { getProjects } from "@/lib/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Project Gallery",
  description:
    "Explore aluminium, glass balustrade, steel, privacy screen and carpentry projects by EK Constructions across Sydney.",
};

type GalleryPageProps = {
  searchParams: Promise<{ category?: string }>;
};

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const [{ category: urlCategory }, projects, cms] = await Promise.all([
    searchParams,
    getProjects(),
    readCms(),
  ]);
  const categoryCount = new Set(projects.map((p) => p.category)).size;

  return (
    <>
      <Header />
      <main id="main-content" className="bg-white pt-[68px] lg:pt-[74px]">
        <section className="gallery-hero-band relative overflow-hidden border-b border-ek-navy/8">
          <div className="gallery-hero-band-glow pointer-events-none absolute inset-0" aria-hidden />
          <div className="landing-container relative py-12 md:py-16 lg:py-[4.5rem]">
            <p className="text-[10px] font-semibold tracking-[0.35em] text-ek-teal uppercase">
              Our Work
            </p>
            <h1 className="mt-3 max-w-3xl text-3xl font-black tracking-tight text-ek-navy uppercase sm:text-4xl md:text-5xl">
              Project Gallery
            </h1>
            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ek-muted sm:text-base md:text-[17px] md:leading-relaxed">
              {projects.length > 0
                ? "Browse completed aluminium glazing, frameless glass balustrades, privacy screens, steel work and carpentry across Sydney and Greater NSW."
                : "Our portfolio is being refreshed with recent project photography. Follow us on Instagram for the latest work, or get in touch for examples similar to your project."}
            </p>

            {projects.length > 0 && (
              <dl className="mt-8 flex flex-wrap gap-3 sm:gap-4">
                <div className="gallery-stat-pill">
                  <dt className="sr-only">Projects</dt>
                  <dd className="text-lg font-black text-ek-navy sm:text-xl">{projects.length}</dd>
                  <dd className="text-[10px] font-semibold tracking-[0.14em] text-ek-muted uppercase">
                    Projects
                  </dd>
                </div>
                <div className="gallery-stat-pill">
                  <dt className="sr-only">Categories</dt>
                  <dd className="text-lg font-black text-ek-navy sm:text-xl">{categoryCount}</dd>
                  <dd className="text-[10px] font-semibold tracking-[0.14em] text-ek-muted uppercase">
                    Categories
                  </dd>
                </div>
                <div className="gallery-stat-pill">
                  <dt className="sr-only">Specialties</dt>
                  <dd className="text-lg font-black text-ek-navy sm:text-xl">
                    {PROJECT_CATEGORIES.length - 1}
                  </dd>
                  <dd className="text-[10px] font-semibold tracking-[0.14em] text-ek-muted uppercase">
                    Specialties
                  </dd>
                </div>
              </dl>
            )}
          </div>
        </section>

        <GalleryGrid
          projects={projects}
          title="All Projects"
          subtitle="Showcase"
          description="Filter by trade to explore glazing, balustrades, privacy screens, steel, and carpentry."
          sectionId="gallery-showcase"
          syncUrl
          urlCategory={urlCategory ?? null}
          instagramUrl={cms.site.instagramUrl}
          instagramHandle={cms.site.instagramHandle}
        />
      </main>
      <Footer />
    </>
  );
}
