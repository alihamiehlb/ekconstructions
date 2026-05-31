"use client";

import { GalleryEmptyState } from "@/components/gallery/GalleryEmptyState";
import { useSite } from "@/components/providers/SiteProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GalleryTeaser() {
  const site = useSite();

  return (
    <section
      id="gallery"
      className="section-block bg-ek-surface pb-14 pt-10 sm:pb-16 sm:pt-12"
      aria-labelledby="gallery-heading"
    >
      <div className="landing-container">
        <SectionHeading
          id="gallery-heading"
          eyebrow="Gallery"
          title="Recent Projects"
          description="Real project photography is being added to the portfolio. Follow us for the latest work or get in touch for examples similar to your build."
          align="center"
          className="mx-auto"
        />
        <div className="mt-10" aria-live="polite">
          <GalleryEmptyState
            variant="page"
            instagramUrl={site.instagram.url}
            instagramHandle={site.instagram.handle}
          />
        </div>
      </div>
    </section>
  );
}
