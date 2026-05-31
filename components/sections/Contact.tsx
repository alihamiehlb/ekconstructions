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
    <section id="contact" className="section-block section-block-dark section-pad">
      <div className="grid gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            title="Get a Quote"
            description="Share your plans or photos and we'll respond with availability and next steps."
            theme="dark"
          />

          <StaggerReveal className="mt-8 space-y-5 text-sm text-white/85 sm:mt-10 lg:text-base">
            <StaggerItem>
              <li className="flex list-none items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-ek-teal" aria-hidden />
                <span>
                  {site.location.suburb}, {site.location.state} · {site.location.area}
                </span>
              </li>
            </StaggerItem>
            <StaggerItem>
              <li className="flex list-none items-center gap-3">
                <Mail className="h-5 w-5 shrink-0 text-ek-teal" aria-hidden />
                <a
                  href={`mailto:${site.contact.email}`}
                  className="transition-colors duration-300 hover:text-ek-teal"
                >
                  {site.contact.email}
                </a>
              </li>
            </StaggerItem>
            <StaggerItem>
              <li className="flex list-none items-center gap-3">
                <Instagram className="h-5 w-5 shrink-0 text-ek-teal" aria-hidden />
                <a
                  href={site.instagram.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition-colors duration-300 hover:text-ek-teal"
                >
                  @{site.instagram.handle}
                </a>
              </li>
            </StaggerItem>
          </StaggerReveal>
        </div>

        <SectionReveal delay={0.1}>
          <div className="rounded-2xl bg-white p-5 text-ek-navy shadow-[0_24px_60px_-30px_rgba(0,0,0,0.45)] sm:p-6 md:p-8">
            <ContactForm />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
