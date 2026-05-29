import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "secondary" | "dark";

const styles: Record<Variant, string> = {
  primary: "btn-primary",
  secondary: "btn-play border border-ek-navy/15 px-6 py-3.5 rounded-md",
  dark:
    "inline-flex items-center gap-2 rounded-md bg-ek-navy px-6 py-3.5 text-xs font-bold tracking-[0.18em] text-white uppercase hover:bg-ek-navy-light",
};

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  external?: boolean;
};

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
  external,
}: Props) {
  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles[variant]} ${className}`}
      >
        {children}
        <ArrowRight className="h-4 w-4" aria-hidden />
      </a>
    );
  }

  return (
    <Link href={href} className={`${styles[variant]} ${className}`}>
      {children}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  );
}
