"use client";

import { ContactForm } from "@/components/sections/ContactForm";
import { useSite } from "@/components/providers/SiteProvider";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { StaggerItem, StaggerReveal } from "@/components/ui/StaggerReveal";
import { Instagram, Mail, MapPin } from "lucide-react";

export function Contact() {
  const site = useSite();

  return (
    <section
      id="contact"
      className="section-block section-block-dark section-pad"
      aria-labelledby="contact-heading"
    >
      <div className="grid gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            id="contact-heading"
            eyebrow="Contact"
            title="Get a Quote"
            description="Share your plans or photos and we'll respond with availability and next steps."
            theme="dark"
          />

          <StaggerReveal className="contact-detail-list mt-8 sm:mt-10">
            <StaggerItem>
              <div className="contact-detail-item">
                <span className="contact-detail-icon">
                  <MapPin className="h-4 w-4" aria-hidden />
                </span>
                <span className="pt-2 text-sm text-white/88 lg:text-base">
                  {site.location.suburb}, {site.location.state} · {site.location.area}
                </span>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="contact-detail-item">
                <span className="contact-detail-icon">
                  <Mail className="h-4 w-4" aria-hidden />
                </span>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="pt-2 text-sm text-white/88 transition-colors duration-300 hover:text-white lg:text-base"
                >
                  {site.contact.email}
                </a>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="contact-detail-item">
                <span className="contact-detail-icon">
                  <Instagram className="h-4 w-4" aria-hidden />
                </span>
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pt-2 text-sm text-white/88 transition-colors duration-300 hover:text-white lg:text-base"
                >
                  @{site.instagram.handle}
                </a>
              </div>
            </StaggerItem>
          </StaggerReveal>
        </div>

        <SectionReveal delay={0.1}>
          <div className="rounded-xl border border-white/8 bg-white p-5 text-ek-navy shadow-[0_24px_60px_-30px_rgba(0,0,0,0.55)] sm:p-6 md:p-8">
            <ContactForm />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
