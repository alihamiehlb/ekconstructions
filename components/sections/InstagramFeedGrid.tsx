"use client";

import { useSite } from "@/components/providers/SiteProvider";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { InstagramFeedCard } from "@/components/sections/InstagramFeedCard";
import type { InstagramPost } from "@/lib/instagram/types";
import { Instagram } from "lucide-react";
import Link from "next/link";

type Props = {
  posts: InstagramPost[];
};

export function InstagramFeedGrid({ posts }: Props) {
  const site = useSite();

  if (posts.length === 0) {
    return (
      <SectionReveal delay={0.12} className="mt-8">
        <div className="overflow-hidden rounded-xl border border-ek-navy/10 bg-white p-8 shadow-sm md:p-10">
          <p className="text-sm text-ek-muted">
            Sync posts from{" "}
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ek-teal hover:underline"
            >
              @{site.instagram.handle}
            </a>{" "}
            in{" "}
            <Link href="/admin/instagram" className="font-semibold text-ek-teal hover:underline">
              Admin → Instagram
            </Link>{" "}
            (paste post URLs — we pull image links automatically).
          </p>
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-6 inline-flex"
          >
            View @{site.instagram.handle}
            <Instagram className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </SectionReveal>
    );
  }

  return (
    <SectionReveal delay={0.12} className="mt-8">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:gap-5">
        {posts.map((post, i) => (
          <InstagramFeedCard key={post.id} post={post} index={i} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <a
          href={site.instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary inline-flex"
        >
          Follow @{site.instagram.handle}
          <Instagram className="h-4 w-4" aria-hidden />
        </a>
      </div>
    </SectionReveal>
  );
}
