"use client";

import { useReducedMotion } from "framer-motion";
import { GripVertical } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt: string;
  afterAlt: string;
  title: string;
  location?: string;
  className?: string;
  priority?: boolean;
};

function isRemote(src: string) {
  return src.startsWith("http://") || src.startsWith("https://");
}

export function BeforeAfterCompare({
  beforeSrc,
  afterSrc,
  beforeAlt,
  afterAlt,
  title,
  location,
  className = "",
  priority = false,
}: Props) {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const [position, setPosition] = useState(50);
  const [hintDone, setHintDone] = useState(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    if (width <= 0) return;
    const pct = ((clientX - left) / width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  useEffect(() => {
    if (reduceMotion || hintDone) return;
    const el = containerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHintDone(true);
        let step = 0;
        const frames = [50, 38, 62, 50];
        const id = window.setInterval(() => {
          step += 1;
          if (step >= frames.length) {
            window.clearInterval(id);
            return;
          }
          setPosition(frames[step] ?? 50);
        }, 420);
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [reduceMotion, hintDone]);

  return (
    <figure className={`before-after-card ${className}`}>
      <div
        ref={containerRef}
        className="before-after-frame group relative aspect-[4/3] cursor-ew-resize touch-none select-none overflow-hidden rounded-2xl bg-ek-navy shadow-xl ring-1 ring-ek-navy/10 sm:aspect-[16/10]"
        onPointerDown={(e) => {
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          setFromClientX(e.clientX);
        }}
        onPointerUp={(e) => {
          dragging.current = false;
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
        role="img"
        aria-label={`${title} before and after comparison. Drag to compare.`}
      >
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          priority={priority}
          quality={75}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 896px"
          className="object-cover object-center"
          unoptimized={isRemote(afterSrc)}
        />

        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={beforeSrc}
            alt={beforeAlt}
            fill
            quality={75}
            loading={priority ? undefined : "lazy"}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 896px"
            className="object-cover object-center"
            unoptimized={isRemote(beforeSrc)}
          />
        </div>

        <div
          className="before-after-divider absolute inset-y-0 z-20 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_12px_rgba(0,0,0,0.35)]"
          style={{ left: `${position}%` }}
        >
          <span className="before-after-handle absolute top-1/2 left-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-ek-teal text-white shadow-lg transition group-hover:scale-105">
            <GripVertical className="h-5 w-5" aria-hidden />
          </span>
        </div>

        <span className="before-after-label before-after-label--before">Before</span>
        <span className="before-after-label before-after-label--after">After</span>
      </div>

      <figcaption className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="text-sm font-black tracking-tight text-ek-navy uppercase sm:text-base">
            {title}
          </h3>
          {location ? (
            <p className="mt-1 text-xs text-ek-muted">{location}</p>
          ) : null}
        </div>
        <p className="text-[10px] font-semibold tracking-[0.18em] text-ek-teal uppercase">
          Drag to compare
        </p>
      </figcaption>
    </figure>
  );
}
