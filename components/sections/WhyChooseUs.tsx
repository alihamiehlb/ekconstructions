"use client";

import { ServiceIcon } from "@/components/icons/ServiceIcons";
import { useSite } from "@/components/providers/SiteProvider";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { StaggerItem, StaggerReveal } from "@/components/ui/StaggerReveal";
import type { CmsWhyItem } from "@/lib/cms/types";
import { motion, useSpring, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

function AnimatedCounter({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const spring = useSpring(0, { stiffness: 60, damping: 20 });
  const display = useTransform(spring, (v) => `${Math.round(v)}+`);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (inView) spring.set(target);
  }, [inView, spring, target]);

  useEffect(() => {
    return display.on("change", (v) => {
      if (ref.current) ref.current.textContent = v;
    });
  }, [display]);

  return <span ref={ref}>0+</span>;
}

export function WhyChooseUs({
  items,
  projectsDelivered,
}: {
  items: CmsWhyItem[];
  projectsDelivered: string;
}) {
  const site = useSite();
  const projectCount = parseInt(projectsDelivered.replace(/\D/g, ""), 10) || 500;

  return (
    <section className="bg-white py-10 md:py-12 lg:py-14">
      <div className="landing-container">
        <SectionReveal>
          <h2 className="text-[1.45rem] font-black tracking-tight text-ek-navy uppercase sm:text-[1.65rem] lg:text-[1.85rem]">
            Why Choose Us?
          </h2>
        </SectionReveal>

        <div className="mt-8 grid items-stretch gap-8 lg:grid-cols-[1fr_290px] xl:grid-cols-[1fr_310px]">
          <StaggerReveal className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-2 xl:gap-4">
            {items.map((item) => (
              <StaggerItem key={item.title}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ type: "spring", stiffness: 380, damping: 24 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-ek-gray text-ek-navy transition-colors hover:bg-ek-teal/10">
                    <ServiceIcon name={item.icon} className="h-8 w-8" />
                  </div>
                  <h3 className="max-w-[7.5rem] text-[9px] leading-[1.35] font-bold tracking-[0.05em] text-ek-navy uppercase sm:text-[10px]">
                    {item.title}
                  </h3>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerReveal>

          <SectionReveal delay={0.15}>
            <aside className="flex flex-col justify-center bg-ek-gray px-6 py-8 text-center sm:px-7 sm:py-9 lg:px-8 lg:py-10 lg:text-left">
              <div className="grid grid-cols-2 items-start gap-4 sm:gap-6">
                <div className="rounded-xl border-2 border-ek-orange/35 bg-white px-3 py-4 shadow-sm sm:px-4">
                  <p className="text-[2rem] leading-none font-black text-ek-orange sm:text-[2.35rem] lg:text-[2.5rem]">
                    {site.business.yearsExperience}
                  </p>
                  <p className="mt-2 text-[9px] font-bold tracking-[0.08em] text-ek-navy uppercase leading-snug">
                    Years Experience
                  </p>
                </div>

                <div className="rounded-xl border border-ek-teal/25 bg-white px-3 py-4 shadow-sm sm:px-4">
                  <p className="text-[2rem] leading-none font-black text-ek-teal sm:text-[2.35rem] lg:text-[2.5rem]">
                    <AnimatedCounter target={projectCount} />
                  </p>
                  <p className="mt-2 text-[9px] font-bold tracking-[0.08em] text-ek-navy uppercase leading-snug">
                    Projects Delivered
                  </p>
                </div>
              </div>

              <Link
                href="/gallery"
                className="btn-primary mt-6 inline-flex w-full justify-center shadow-sm lg:w-auto lg:justify-start"
              >
                View Our Work
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </aside>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
