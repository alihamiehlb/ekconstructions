import { PROJECT_CATEGORIES } from "@/lib/project-categories";
import { ArrowRight, Camera, Instagram } from "lucide-react";
import Link from "next/link";

type Props = {
  variant?: "page" | "filter";
  instagramUrl?: string;
  instagramHandle?: string;
  onShowAll?: () => void;
};

export function GalleryEmptyState({
  variant = "page",
  instagramUrl,
  instagramHandle,
  onShowAll,
}: Props) {
  if (variant === "filter") {
    return (
      <div className="gallery-empty-state rounded-2xl border border-ek-navy/8 bg-white px-6 py-10 text-center">
        <p className="text-sm font-bold text-ek-navy">No projects in this category</p>
        <p className="mt-2 text-sm text-ek-muted">Try another filter or view all projects.</p>
        {onShowAll ? (
          <button
            type="button"
            onClick={onShowAll}
            className="mt-4 text-xs font-semibold tracking-wide text-ek-teal uppercase hover:underline"
          >
            Show all
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className="gallery-empty-panel mt-10 overflow-hidden rounded-2xl border border-ek-navy/8 bg-white shadow-[0_20px_50px_-30px_rgba(10,10,10,0.25)]">
      <div className="gallery-empty-panel-glow pointer-events-none" aria-hidden />
      <div className="relative grid gap-8 px-6 py-12 sm:px-10 sm:py-14 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-12">
        <div className="max-w-lg">
          <div className="inline-flex items-center gap-2 rounded-full border border-ek-teal/20 bg-ek-teal/5 px-3 py-1 text-[10px] font-bold tracking-[0.14em] text-ek-teal uppercase">
            <Camera className="h-3.5 w-3.5" aria-hidden />
            Portfolio updating
          </div>
          <h2 className="mt-4 text-2xl font-black tracking-tight text-ek-navy uppercase sm:text-3xl">
            New project photos on the way
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ek-muted sm:text-base">
            We&apos;re adding recent aluminium, glass, and steel work to the gallery. For the
            latest installs and finishes, follow us on Instagram or request a quote for your
            project.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/#contact" className="btn-primary inline-flex">
              Get a quote
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            {instagramUrl && instagramHandle ? (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-[3px] border border-ek-navy/12 bg-white px-5 py-3.5 text-[11px] font-bold tracking-[0.14em] text-ek-navy uppercase transition hover:border-ek-teal hover:text-ek-teal"
              >
                <Instagram className="h-4 w-4" aria-hidden />
                @{instagramHandle}
              </a>
            ) : null}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 lg:max-w-xs lg:justify-end">
          {PROJECT_CATEGORIES.filter((c) => c !== "Recent Work").map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-ek-navy/8 bg-ek-gray/80 px-3 py-1.5 text-[9px] font-semibold tracking-[0.08em] text-ek-muted uppercase"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
