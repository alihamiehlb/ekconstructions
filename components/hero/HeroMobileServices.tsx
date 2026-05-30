"use client";

import {
  serviceCardImages,
  serviceIcons,
  WindowIcon,
} from "@/components/hero/serviceIcons";
import type { CmsService } from "@/lib/cms/types";
import Image from "next/image";
import Link from "next/link";

const positions = ["object-center", "object-[70%_center]", "object-[30%_center]", "object-[80%_40%]", "object-left"];

export function HeroMobileServices({ services }: { services: CmsService[] }) {
  return (
    <div id="services" className="hero-mobile-services shrink-0 lg:hidden">
      <div className="hero-mobile-services-track -mx-5 flex gap-2 overflow-x-auto px-5 pb-1 snap-x snap-mandatory md:-mx-8 md:px-8">
        {services.map((service, index) => {
          const Icon = serviceIcons[service.icon as keyof typeof serviceIcons] ?? WindowIcon;
          const image = serviceCardImages[service.id] ?? "/images/hero-building.png";

          return (
            <Link
              key={service.id}
              href="#contact"
              className="hero-mobile-service-card group relative shrink-0 snap-start overflow-hidden"
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="120px"
                className={`object-cover ${positions[index % positions.length]} transition duration-500 group-hover:scale-105`}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/45 to-black/15" />
              <div className="absolute inset-x-0 bottom-0 flex items-end gap-2 p-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ek-teal/35 bg-ek-teal/15">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="pb-0.5 text-[8px] font-bold leading-tight tracking-[0.05em] text-white uppercase">
                  {service.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
