"use client";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { CmsBeforeAfterItem, CmsBeforeAfterSection } from "@/lib/cms/types";
import { secureJsonFetch } from "@/lib/security/client-fetch";
import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function newItem(): CmsBeforeAfterItem {
  const id = `slide-${Date.now().toString(36)}`;
  return {
    id,
    title: "New transformation",
    location: "",
    beforeSrc: "",
    afterSrc: "",
    beforeAlt: "Before photo",
    afterAlt: "After photo",
  };
}

export function AdminBeforeAfterEditor() {
  const router = useRouter();
  const [section, setSection] = useState<CmsBeforeAfterSection | null>(null);
  const [items, setItems] = useState<CmsBeforeAfterItem[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"ok" | "error">("ok");

  useEffect(() => {
    fetch("/api/admin/cms/before-after", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data: { section?: CmsBeforeAfterSection; items?: CmsBeforeAfterItem[] }) => {
        setSection(data.section ?? null);
        setItems(data.items ?? []);
      })
      .catch(() => {
        setMessage("Failed to load before/after content.");
        setMessageTone("error");
      });
  }, []);

  function updateItem(i: number, patch: Partial<CmsBeforeAfterItem>) {
    const next = [...items];
    next[i] = { ...next[i], ...patch };
    setItems(next);
  }

  function removeItem(i: number) {
    const item = items[i];
    if (!confirm(`Remove "${item.title}"?`)) return;
    setItems(items.filter((_, idx) => idx !== i));
  }

  async function save() {
    if (!section) return;
    setSaving(true);
    setMessage("");

    const res = await secureJsonFetch("/api/admin/cms/before-after", {
      method: "PUT",
      body: JSON.stringify({
        section,
        items: items.filter((item) => item.beforeSrc && item.afterSrc),
      }),
    });

    const data = (await res.json()) as { error?: string; count?: number };
    setSaving(false);

    if (!res.ok) {
      setMessage(data.error ?? "Save failed.");
      setMessageTone("error");
      return;
    }

    setMessage(`Saved ${data.count ?? items.length} slide(s). Refresh the homepage to preview.`);
    setMessageTone("ok");
    router.refresh();
  }

  if (!section) {
    return <p className="text-sm text-ek-muted">Loading before/after content…</p>;
  }

  return (
    <div className="space-y-8">
      {message && (
        <p
          className={`rounded-lg border px-4 py-3 text-sm ${
            messageTone === "ok"
              ? "border-ek-teal/30 bg-ek-teal/10 text-ek-navy"
              : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {message}
        </p>
      )}

      <section className="rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">Section heading</h2>
        <p className="mt-1 text-xs text-ek-muted">
          Shown above the slider on the homepage (#transformations).
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="block text-sm">
            <span className="font-medium text-ek-navy">Eyebrow</span>
            <input
              className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
              value={section.eyebrow}
              onChange={(e) => setSection({ ...section, eyebrow: e.target.value })}
            />
          </label>
          <label className="block text-sm md:col-span-1">
            <span className="font-medium text-ek-navy">Title</span>
            <input
              className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
              value={section.title}
              onChange={(e) => setSection({ ...section, title: e.target.value })}
            />
          </label>
          <label className="block text-sm md:col-span-3">
            <span className="font-medium text-ek-navy">Subtitle</span>
            <textarea
              rows={2}
              className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
              value={section.subtitle}
              onChange={(e) => setSection({ ...section, subtitle: e.target.value })}
            />
          </label>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">Slides</h2>
            <p className="mt-1 text-xs text-ek-muted">
              Upload a before and after photo for each project. Visitors drag the handle to compare.
            </p>
          </div>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-ek-navy/15 px-3 py-2 text-xs font-semibold tracking-wide text-ek-navy uppercase transition hover:border-ek-teal hover:text-ek-teal"
            onClick={() => setItems([...items, newItem()])}
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add slide
          </button>
        </div>

        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-ek-navy/15 bg-ek-gray/40 px-4 py-8 text-center text-sm text-ek-muted">
            No slides yet. Add your first before/after pair.
          </p>
        )}

        {items.map((item, i) => (
          <article
            key={item.id}
            className="rounded-2xl border border-ek-navy/10 bg-white p-5 shadow-sm sm:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-bold tracking-wide text-ek-muted uppercase">Slide {i + 1}</p>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 uppercase hover:underline"
                onClick={() => removeItem(i)}
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
                Remove
              </button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-ek-navy">Project title</span>
                <input
                  className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                  value={item.title}
                  onChange={(e) => updateItem(i, { title: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-ek-navy">Location (optional)</span>
                <input
                  className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                  value={item.location}
                  placeholder="North Ryde, NSW"
                  onChange={(e) => updateItem(i, { location: e.target.value })}
                />
              </label>
              <ImageUploadField
                label="Before photo"
                value={item.beforeSrc}
                onChange={(beforeSrc) => updateItem(i, { beforeSrc })}
              />
              <ImageUploadField
                label="After photo"
                value={item.afterSrc}
                onChange={(afterSrc) => updateItem(i, { afterSrc })}
              />
              <label className="block text-sm">
                <span className="font-medium text-ek-navy">Before alt text</span>
                <input
                  className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                  value={item.beforeAlt}
                  onChange={(e) => updateItem(i, { beforeAlt: e.target.value })}
                />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-ek-navy">After alt text</span>
                <input
                  className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                  value={item.afterAlt}
                  onChange={(e) => updateItem(i, { afterAlt: e.target.value })}
                />
              </label>
            </div>
          </article>
        ))}
      </section>

      <button
        type="button"
        disabled={saving}
        onClick={() => void save()}
        className="btn-primary disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save before & after section"}
      </button>
    </div>
  );
}
