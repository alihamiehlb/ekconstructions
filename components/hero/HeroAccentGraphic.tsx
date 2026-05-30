"use client";

import { motion, useReducedMotion } from "framer-motion";

type Props = {
  compact?: boolean;
  scrollProgress?: number;
};

export function HeroAccentGraphic({ compact = false, scrollProgress = 0 }: Props) {
  const reduceMotion = useReducedMotion();
  const scale = 1 - scrollProgress * 0.06;
  const opacity = 1 - scrollProgress * 0.35;

  return (
    <motion.div
      className={`hero-accent ${compact ? "hero-accent--compact" : ""}`}
      aria-hidden
      animate={reduceMotion ? undefined : { scale, opacity }}
      transition={{ type: "spring", stiffness: 120, damping: 24 }}
    >
      <svg viewBox="0 0 280 320" className="hero-accent-svg" fill="none">
        <defs>
          <linearGradient id="heroAccentStroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#db2022" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#0a0a0a" stopOpacity="0.35" />
          </linearGradient>
        </defs>

        <g className="hero-accent-grid" stroke="currentColor" strokeWidth="0.6" opacity="0.12">
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`v${i}`} x1={28 + i * 28} y1="24" x2={28 + i * 28} y2="296" />
          ))}
          {Array.from({ length: 10 }, (_, i) => (
            <line key={`h${i}`} x1="20" y1={24 + i * 28} x2="260" y2={24 + i * 28} />
          ))}
        </g>

        <path
          className="hero-accent-line hero-accent-line--slow"
          d="M72 248V96l68-32 68 32v152"
          stroke="url(#heroAccentStroke)"
          strokeWidth="2.2"
          strokeLinejoin="round"
        />
        <path
          className="hero-accent-line"
          d="M72 248h136M72 184h136M72 120h136"
          stroke="url(#heroAccentStroke)"
          strokeWidth="1.4"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          className="hero-accent-line hero-accent-line--delay"
          d="M104 248V152M176 248V152M140 216V120"
          stroke="#db2022"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.55"
        />
        <rect
          className="hero-accent-line hero-accent-line--pulse"
          x="118"
          y="152"
          width="44"
          height="52"
          rx="2"
          stroke="#db2022"
          strokeWidth="1.5"
          opacity="0.7"
        />
      </svg>

      <span className="hero-accent-ring" />
      <span className="hero-accent-ring hero-accent-ring--delay" />
    </motion.div>
  );
}
