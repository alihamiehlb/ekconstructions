import Link from "next/link";
import { LogoWordmark } from "@/components/brand/LogoWordmark";

type Props = {
  className?: string;
  size?: "header" | "loader";
  asLink?: boolean;
  variant?: "light" | "dark";
};

const heights = {
  header: 42,
  loader: 60,
} as const;

export function Logo({ className = "", size = "header", asLink = true, variant = "light" }: Props) {
  const height = heights[size];
  const mark = (
    <LogoWordmark height={height} className={`logo-header-mark ${className}`} variant={variant} />
  );

  if (!asLink) return mark;

  return (
    <Link
      href="/#home"
      className="logo-link inline-flex min-h-11 min-w-[7.5rem] shrink-0 items-center justify-center rounded-md px-1 transition-opacity hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ek-teal sm:min-w-[8.25rem]"
      aria-label="EK Constructions home"
    >
      {mark}
    </Link>
  );
}
