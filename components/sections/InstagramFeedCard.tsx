"use client";

import type { InstagramPost } from "@/lib/instagram/types";
import { motion, useReducedMotion } from "framer-motion";
import { ExternalLink, Layers } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

function imageSrc(post: InstagramPost, slide: number): string {
  const images = post.images.length ? post.images : [post.thumbnail];
  return images[slide] ?? post.thumbnail;
}

export function InstagramFeedCard({
  post,
  index,
}: {
  post: InstagramPost;
  index: number;
}) {
  const reduceMotion = useReducedMotion();
  const images = post.images.length ? post.images : [post.thumbnail];
  const [slide, setSlide] = useState(0);
  const [src, setSrc] = useState(() => imageSrc(post, 0));
  const multi = images.length > 1;

  useEffect(() => {
    setSrc(imageSrc(post, slide));
  }, [post, slide]);

  useEffect(() => {
    if (!multi || reduceMotion) return;
    const id = window.setInterval(() => setSlide((s) => (s + 1) % images.length), 2800);
    return () => window.clearInterval(id);
  }, [multi, reduceMotion, images.length]);

  const galleryHref = `/gallery/ig-${post.shortcode}`;
  const fallbackSrc = `/api/instagram/image?shortcode=${encodeURIComponent(post.shortcode)}`;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="ig-feed-card group relative aspect-square overflow-hidden rounded-xl border border-ek-navy/8 bg-ek-gray shadow-sm"
    >
      <Link href={galleryHref} className="absolute inset-0 z-10" aria-label={`View project ${post.shortcode}`}>
        <span className="sr-only">Open gallery project</span>
      </Link>

      <motion.div
        key={src}
        className="absolute inset-0"
        initial={reduceMotion ? false : { opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={src}
          alt={post.caption || post.title || "EK Constructions project"}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          unoptimized
          onError={() => {
            if (src !== fallbackSrc) setSrc(fallbackSrc);
          }}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ek-navy/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between p-3">
        {multi && (
          <span className="flex items-center gap-1 rounded-full bg-black/50 px-2 py-1 text-[9px] font-bold text-white backdrop-blur-sm">
            <Layers className="h-3 w-3" aria-hidden />
            {images.length}
          </span>
        )}
        <a
          href={post.permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="pointer-events-auto ml-auto flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[9px] font-bold text-ek-navy opacity-0 transition group-hover:opacity-100"
          onClick={(e) => e.stopPropagation()}
        >
          IG
          <ExternalLink className="h-3 w-3" aria-hidden />
        </a>
      </div>
    </motion.div>
  );
}
