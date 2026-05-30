import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Materials } from "@/components/sections/Materials";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { Services } from "@/components/sections/Services";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { readCms } from "@/lib/cms";
import { getProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [projects, cms] = await Promise.all([getProjects(), readCms()]);

  return (
    <>
      <Header />
      <main id="main-content">
        <div className="bg-white">
          <Hero />
          <Services services={cms.services} />
          <WhyChooseUs
            items={cms.whyChooseUs}
            projectsDelivered={cms.site.projectsDelivered}
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
