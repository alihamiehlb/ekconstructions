import nextDynamic from "next/dynamic";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Materials } from "@/components/sections/Materials";
import { Services } from "@/components/sections/Services";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { readCms } from "@/lib/cms";
import { getProjects } from "@/lib/projects";

const ProjectGallery = nextDynamic(
  () =>
    import("@/components/sections/ProjectGallery").then((m) => ({
      default: m.ProjectGallery,
    })),
  {
    loading: () => <div className="section-skeleton min-h-[420px] bg-ek-gray/30" aria-hidden />,
  },
);

const GalleryTeaser = nextDynamic(
  () =>
    import("@/components/sections/GalleryTeaser").then((m) => ({
      default: m.GalleryTeaser,
    })),
  {
    loading: () => <div className="section-skeleton min-h-[320px] bg-ek-surface" aria-hidden />,
  },
);

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [projects, cms] = await Promise.all([getProjects(), readCms()]);

  return (
    <>
      <Header />
      <main id="main-content" className="pb-20 lg:pb-0">
        <Hero />
        <Services services={cms.services} />
        <div className="section-fade-from-dark" aria-hidden />
        <WhyChooseUs
          items={cms.whyChooseUs}
          projectsDelivered={cms.site.projectsDelivered}
          yearsExperience={cms.site.yearsExperience}
        />
        <ProjectGallery projects={projects} />
        {projects.length === 0 && <GalleryTeaser />}
        <About />
        <Materials materials={cms.materials} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
