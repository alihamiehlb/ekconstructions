"use client";

import {
  isInstagramPostUrl,
  isValidGalleryImageSrc,
} from "@/lib/gallery-image";
import { secureFormFetch, secureJsonFetch } from "@/lib/security/client-fetch";
import { ImagePlus, Instagram, Link2, Loader2 } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
  label: string;
  value: string;
  onChange: (url: string) => void;
};

export function ImageUploadField({ label, value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const trimmed = value.trim();
  const isInstagram = isInstagramPostUrl(trimmed);
  const canPreviewDirect = isValidGalleryImageSrc(trimmed);
  const displayPreview = previewUrl ?? (canPreviewDirect ? trimmed : "");

  async function onFile(file: File) {
    setUploading(true);
    setError("");
    setPreviewUrl(null);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await secureFormFetch("/api/admin/upload", { method: "POST", body: form });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Upload failed");
        return;
      }
      onChange(json.url as string);
    } catch {
      setError("Upload failed. Check connection and Supabase Storage.");
    } finally {
      setUploading(false);
    }
  }

  async function resolveInstagramPreview() {
    if (!isInstagram) return;
    setResolving(true);
    setError("");
    setPreviewUrl(null);
    try {
      const res = await secureJsonFetch("/api/admin/instagram/resolve", {
        method: "POST",
        body: JSON.stringify({ url: trimmed }),
      });
      const json = (await res.json()) as { imageUrl?: string; error?: string };
      if (!res.ok) {
        setError(json.error ?? "Could not load Instagram image");
        return;
      }
      if (json.imageUrl) setPreviewUrl(json.imageUrl);
    } catch {
      setError("Could not reach Instagram. Try again or upload the image.");
    } finally {
      setResolving(false);
    }
  }

  function onUrlBlur() {
    if (isInstagram) void resolveInstagramPreview();
    else setPreviewUrl(null);
  }

  return (
    <div className="md:col-span-2">
      <span className="text-sm font-medium text-ek-navy">{label}</span>
      <div className="mt-2 grid gap-3 sm:grid-cols-[9rem_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-ek-navy/10 bg-ek-gray">
          {displayPreview && isValidGalleryImageSrc(displayPreview) ? (
            <Image
              src={displayPreview}
              alt=""
              fill
              className="object-cover"
              sizes="144px"
              unoptimized={displayPreview.startsWith("http")}
              referrerPolicy={displayPreview.startsWith("http") ? "no-referrer" : undefined}
            />
          ) : isInstagram && resolving ? (
            <div className="gallery-image-empty absolute inset-0">
              <Loader2 className="h-5 w-5 animate-spin text-ek-teal" aria-hidden />
            </div>
          ) : isInstagram ? (
            <div className="gallery-image-empty absolute inset-0 flex-col gap-1">
              <Instagram className="h-5 w-5 text-ek-teal" aria-hidden />
              <span className="gallery-image-empty-label px-2 text-center text-[8px]">
                Save to fetch
              </span>
            </div>
          ) : (
            <div className="gallery-image-empty absolute inset-0">
              <span className="gallery-image-empty-label text-[9px]">Preview</span>
            </div>
          )}
        </div>
        <div className="min-w-0 space-y-2">
          <div className="relative">
            <Link2
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ek-muted"
              aria-hidden
            />
            <input
              className="w-full rounded-lg border border-ek-navy/15 py-2 pr-3 pl-9 text-sm"
              value={value}
              onChange={(e) => {
                setPreviewUrl(null);
                setError("");
                onChange(e.target.value);
              }}
              onBlur={onUrlBlur}
              placeholder="https://… or instagram.com/p/…"
            />
          </div>
          {isInstagram ? (
            <p className="text-xs text-ek-muted">
              Public Instagram post link — click Save gallery to store the image on your site.
            </p>
          ) : null}
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onFile(file);
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-ek-navy/15 px-3 py-2 text-xs font-semibold tracking-wide text-ek-navy uppercase transition hover:border-ek-teal/30 hover:bg-ek-gray disabled:opacity-50"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <ImagePlus className="h-4 w-4" aria-hidden />
            )}
            Upload image
          </button>
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
