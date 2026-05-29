"use client";

import { ContactForm } from "@/components/sections/ContactForm";
import { useSite } from "@/components/providers/SiteProvider";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { StaggerItem, StaggerReveal } from "@/components/ui/StaggerReveal";
import { Instagram, Mail, MapPin } from "lucide-react";

export function Contact() {
  const site = useSite();

  return (
    <section id="contact" className="section-pad bg-ek-navy py-16 text-white sm:py-20 md:py-28">
      <div className="grid gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionReveal>
            <h2 className="text-2xl font-black tracking-tight uppercase sm:text-3xl md:text-4xl">
              Get a Quote
            </h2>
            <p className="mt-4 text-sm text-white/70 sm:text-base">
              Share your plans or photos and we&apos;ll respond with availability and next steps.
            </p>
          </SectionReveal>

          <StaggerReveal className="mt-8 space-y-5 text-sm text-white/85 sm:mt-10">
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
                <a href={`mailto:${site.contact.email}`} className="hover:text-ek-teal">
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
                  className="hover:text-ek-teal"
                >
                  @{site.instagram.handle}
                </a>
              </li>
            </StaggerItem>
          </StaggerReveal>
        </div>

        <SectionReveal delay={0.1}>
          <div className="rounded-2xl bg-white p-5 text-ek-navy sm:p-6 md:p-8">
            <ContactForm />
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
