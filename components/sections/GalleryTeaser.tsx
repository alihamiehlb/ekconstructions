import { readCms } from "@/lib/cms";
import { GalleryEmptyState } from "@/components/gallery/GalleryEmptyState";

export async function GalleryTeaser() {
  const cms = await readCms();

  return (
    <section
      id="gallery"
      className="section-block bg-gradient-to-b from-white via-ek-gray/50 to-ek-gray/40 pb-14 pt-10 sm:pb-16 sm:pt-12"
    >
      <div className="landing-container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-[10px] font-semibold tracking-[0.35em] text-ek-teal uppercase">Gallery</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-ek-navy uppercase sm:text-3xl">
            Recent Projects
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ek-muted sm:text-base">
            Real project photography is being added to the portfolio. Follow us for the latest work
            or get in touch for examples similar to your build.
          </p>
        </div>
        <GalleryEmptyState
          variant="page"
          instagramUrl={cms.site.instagramUrl}
          instagramHandle={cms.site.instagramHandle}
        />
      </div>
    </section>
  );
}
