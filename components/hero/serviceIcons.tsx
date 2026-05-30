import type { SVGProps } from "react";

const iconClass = "h-4 w-4 text-ek-teal sm:h-5 sm:w-5";

export function WindowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" className={iconClass} fill="none" aria-hidden {...props}>
      <rect x="5" y="7" width="22" height="18" stroke="currentColor" strokeWidth="1.25" />
      <path d="M16 7v18M5 16h22" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function BalustradeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" className={iconClass} fill="none" aria-hidden {...props}>
      <rect x="6" y="6" width="20" height="20" stroke="currentColor" strokeWidth="1.25" />
      <path d="M10 24L22 8" stroke="currentColor" strokeWidth="1.25" />
      <path d="M14 24L26 8" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function SteelIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" className={iconClass} fill="none" aria-hidden {...props}>
      <path
        d="M8 24V13l8-6 8 6v11"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M8 13h16" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function FenceIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" className={iconClass} fill="none" aria-hidden {...props}>
      <path
        d="M8 24V8M12 24V8M16 24V8M20 24V8M24 24V8"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function HammerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 32 32" className={iconClass} fill="none" aria-hidden {...props}>
      <path d="M9 23l10-10" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path
        d="M15 9l8 8-3 3-8-8 3-3z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export const serviceIcons = {
  window: WindowIcon,
  balustrade: BalustradeIcon,
  steel: SteelIcon,
  fence: FenceIcon,
  hammer: HammerIcon,
} as const;

export const serviceCardImages: Record<string, string> = {
  aluminium: "/images/hero-building.png",
  balustrade: "/images/hero-bg.jpg",
  steel: "/images/hero-building.png",
  privacy: "/images/hero-bg.jpg",
  carpentry: "/images/hero-building.png",
};
