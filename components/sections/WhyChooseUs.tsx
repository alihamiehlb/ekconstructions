"use client";

import { ServiceIcon } from "@/components/icons/ServiceIcons";
import type { CmsWhyItem } from "@/lib/cms/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSpring, useTransform } from "framer-motion";
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
  const projectCount = parseInt(projectsDelivered.replace(/\D/g, ""), 10) || 500;

  return (
    <section className="bg-white py-10 md:py-12 lg:py-14">
      <div className="landing-container">
        <h2 className="text-[1.45rem] font-black tracking-tight text-ek-navy uppercase sm:text-[1.65rem] lg:text-[1.85rem]">
          Why Choose Us?
        </h2>

        <div className="mt-8 grid items-stretch gap-8 lg:grid-cols-[1fr_290px] xl:grid-cols-[1fr_310px]">
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-2 xl:gap-4">
            {items.map((item) => (
              <div key={item.title} className="flex flex-col items-center text-center">
                <div className="mb-3 flex h-11 w-11 items-center justify-center text-ek-navy">
                  <ServiceIcon name={item.icon} className="h-8 w-8" />
                </div>
                <h3 className="max-w-[7.5rem] text-[9px] leading-[1.35] font-bold tracking-[0.05em] text-ek-navy uppercase sm:text-[10px]">
                  {item.title}
                </h3>
              </div>
            ))}
          </div>

          <aside className="flex flex-col justify-center bg-ek-gray px-6 py-8 text-center sm:px-7 sm:py-9 lg:px-8 lg:py-10 lg:text-left">
            <p className="text-[2.5rem] leading-none font-black text-ek-teal sm:text-[2.75rem] lg:text-[3rem]">
              <AnimatedCounter target={projectCount} />
            </p>
            <p className="mt-3 text-[10px] font-bold tracking-[0.1em] text-ek-navy uppercase leading-snug">
              Projects Successfully Delivered
            </p>
            <Link
              href="/gallery"
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-[3px] bg-ek-navy px-6 py-3.5 text-[10px] font-bold tracking-[0.18em] text-white uppercase transition hover:bg-ek-navy-light lg:justify-start"
            >
              View Our Work
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </aside>
        </div>
      </div>
    </section>
  );
}
