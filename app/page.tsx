import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { BeforeAfterShowcase } from "@/components/sections/BeforeAfterShowcase";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Materials } from "@/components/sections/Materials";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { Services } from "@/components/sections/Services";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { readCms } from "@/lib/cms";
import { getProjects } from "@/lib/projects";

export const revalidate = 120;

export default async function HomePage() {
  const [projects, cms] = await Promise.all([getProjects(), readCms()]);

  return (
    <>
      <Header />
      <main id="main-content" className="pb-20 lg:pb-0">
        <Hero services={cms.services} />
        <Services services={cms.services} />
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
