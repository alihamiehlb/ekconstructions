"use client";

import { secureFormFetch } from "@/lib/security/client-fetch";
import { ImagePlus, Loader2 } from "lucide-react";
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
  const [error, setError] = useState("");

  async function onFile(file: File) {
    setUploading(true);
    setError("");
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

  const previewSrc = value.startsWith("http") ? value : value || null;

  return (
    <div className="md:col-span-2">
      <span className="text-sm font-medium text-ek-navy">{label}</span>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
        {previewSrc && (
          <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-lg border border-ek-navy/10 bg-ek-gray">
            <Image src={previewSrc} alt="" fill className="object-cover" sizes="144px" unoptimized={previewSrc.startsWith("http")} />
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <input
            className="w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://... or /images/gallery/photo.jpg"
          />
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void onFile(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-ek-navy/15 bg-white px-3 py-2 text-xs font-semibold tracking-wide text-ek-navy uppercase transition hover:border-ek-teal hover:text-ek-teal disabled:opacity-60"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <ImagePlus className="h-4 w-4" aria-hidden />
            )}
            {uploading ? "Uploading…" : "Or upload to Supabase"}
          </button>
          {error && (
            <p className="text-xs text-red-600" role="alert">
              {error}
            </p>
          )}
          <p className="text-xs text-ek-muted">
            Paste a direct image URL above, or upload (max 5 MB) when Supabase is configured.
          </p>
        </div>
      </div>
    </div>
  );
}
