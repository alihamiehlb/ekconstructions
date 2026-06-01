"use client";

import { isAcceptableGalleryImageInput, isInstagramPostUrl } from "@/lib/gallery-image";
import { parseSlideUrlLines } from "@/lib/gallery-slides";
import { Instagram, Link2, Plus, Trash2 } from "lucide-react";
import { useId } from "react";

type Props = {
  slides: string[];
  onChange: (slides: string[]) => void;
};

export function GallerySlidesField({ slides, onChange }: Props) {
  const listId = useId();

  function updateSlide(index: number, value: string) {
    const next = [...slides];
    next[index] = value;
    onChange(next);
  }

  function removeSlide(index: number) {
    onChange(slides.filter((_, i) => i !== index));
  }

  function addSlide() {
    onChange([...slides, ""]);
  }

  function onBulkPaste(index: number, pasted: string) {
    const parts = parseSlideUrlLines(pasted);
    if (parts.length <= 1) {
      updateSlide(index, pasted);
      return;
    }
    const next = [...slides];
    next[index] = parts[0];
    next.splice(index + 1, 0, ...parts.slice(1));
    onChange(next);
  }

  return (
    <div className="md:col-span-2">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <span className="text-sm font-medium text-ek-navy">Extra slides</span>
          <p className="mt-0.5 text-xs text-ek-muted">
            Add more photos for the carousel — one link per row. Instagram post links work; each
            slide is saved to your site on Save gallery.
          </p>
        </div>
        <button
          type="button"
          onClick={addSlide}
          className="inline-flex items-center gap-1.5 rounded-lg border border-ek-navy/15 px-3 py-1.5 text-[10px] font-bold tracking-wide text-ek-teal uppercase transition hover:border-ek-teal/30 hover:bg-ek-gray"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Add slide
        </button>
      </div>

      {slides.length === 0 ? (
        <p className="mt-3 rounded-lg border border-dashed border-ek-navy/12 bg-ek-gray/50 px-3 py-4 text-center text-xs text-ek-muted">
          No extra slides — cover image only. Click Add slide for a multi-photo project.
        </p>
      ) : (
        <ul id={listId} className="mt-3 space-y-2">
          {slides.map((url, index) => {
            const trimmed = url.trim();
            const isInstagram = isInstagramPostUrl(trimmed);
            const ok = !trimmed || isAcceptableGalleryImageInput(trimmed);

            return (
              <li
                key={`slide-${index}`}
                className={`flex gap-2 rounded-lg border p-2 ${
                  ok ? "border-ek-navy/10 bg-white" : "border-amber-200 bg-amber-50/80"
                }`}
              >
                <span className="flex w-6 shrink-0 items-center justify-center text-[10px] font-bold text-ek-muted">
                  {index + 1}
                </span>
                <div className="relative min-w-0 flex-1">
                  {isInstagram ? (
                    <Instagram
                      className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-sky-600"
                      aria-hidden
                    />
                  ) : (
                    <Link2
                      className="pointer-events-none absolute top-1/2 left-2.5 h-3.5 w-3.5 -translate-y-1/2 text-ek-muted"
                      aria-hidden
                    />
                  )}
                  <input
                    className={`w-full rounded-md border py-2 pr-2 text-sm ${
                      isInstagram ? "border-sky-200 pl-8" : "border-ek-navy/15 pl-8"
                    }`}
                    value={url}
                    placeholder="instagram.com/p/… or image URL"
                    aria-label={`Slide ${index + 1} image link`}
                    onChange={(e) => updateSlide(index, e.target.value)}
                    onPaste={(e) => {
                      const pasted = e.clipboardData.getData("text");
                      if (/[\n,;]/.test(pasted)) {
                        e.preventDefault();
                        onBulkPaste(index, pasted);
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSlide(index)}
                  className="shrink-0 rounded-md p-2 text-red-600 transition hover:bg-red-50"
                  aria-label={`Remove slide ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
