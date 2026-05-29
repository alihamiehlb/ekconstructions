import Link from "next/link";
import { LogoWordmark } from "@/components/brand/LogoWordmark";

type Props = {
  className?: string;
  size?: "header" | "loader";
  asLink?: boolean;
};

const heights = {
  header: 34,
  loader: 52,
} as const;

export function Logo({ className = "", size = "header", asLink = true }: Props) {
  const height = heights[size];
  const mark = <LogoWordmark height={height} className={className} />;

  if (!asLink) return mark;

  return (
    <Link
      href="/#home"
      className="inline-flex shrink-0 items-center transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ek-orange"
      aria-label="EK Constructions home"
    >
      {mark}
    </Link>
  );
}
