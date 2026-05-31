import dynamic from "next/dynamic";
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

const BeforeAfterShowcase = dynamic(
  () =>
    import("@/components/sections/BeforeAfterShowcase").then((m) => ({
      default: m.BeforeAfterShowcase,
    })),
  {
    loading: () => <div className="section-skeleton min-h-[520px] bg-ek-gray" aria-hidden />,
  },
);

const ProjectGallery = dynamic(
  () =>
    import("@/components/sections/ProjectGallery").then((m) => ({
      default: m.ProjectGallery,
    })),
  {
    loading: () => <div className="section-skeleton min-h-[420px] bg-ek-gray/30" aria-hidden />,
  },
);

export const revalidate = 120;

export default async function HomePage() {
  const [projects, cms] = await Promise.all([getProjects(), readCms()]);

  return (
    <>
      <Header />
      <main id="main-content" className="pb-20 lg:pb-0">
        <Hero />
        <Services services={cms.services} />
        <div className="section-fade-from-dark" aria-hidden />
        <div className="bg-white">
          <WhyChooseUs
            items={cms.whyChooseUs}
            projectsDelivered={cms.site.projectsDelivered}
          />
          <BeforeAfterShowcase
            section={cms.beforeAfterSection}
            items={cms.beforeAfterItems}
          />
          <ProjectGallery projects={projects} />
        </div>

        <About />
        <Materials materials={cms.materials} />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
