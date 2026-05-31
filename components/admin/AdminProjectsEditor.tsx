"use client";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { Project } from "@/content/projects";
import {
  DEFAULT_PROJECT_CATEGORY,
  PROJECT_CATEGORIES,
} from "@/lib/project-categories";
import { isValidGalleryImageSrc } from "@/lib/gallery-image";
import { secureJsonFetch } from "@/lib/security/client-fetch";
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GripVertical,
  Plus,
  Star,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function newProject(sortOrder: number): Project {
  return {
    id: `project-${Date.now()}`,
    title: "New project",
    category: DEFAULT_PROJECT_CATEGORY,
    src: "",
    alt: "Project photo",
    description: "Describe the scope, materials, and location.",
    featured: false,
    sortOrder,
    highlights: [],
  };
}

function moveItem<T>(list: T[], from: number, to: number): T[] {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function AdminProjectsEditor() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"ok" | "warn" | "error">("ok");

  useEffect(() => {
    fetch("/api/admin/cms/projects", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data: { projects?: Project[] }) => {
        const list = data.projects ?? [];
        setProjects(list);
        setExpandedId(list[0]?.id ?? null);
      })
      .catch(() => showMessage("Failed to load projects", "error"))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(
    () => ({
      total: projects.length,
      featured: projects.filter((p) => p.featured).length,
      missingImage: projects.filter((p) => !isValidGalleryImageSrc(p.src)).length,
    }),
    [projects],
  );

  function showMessage(text: string, tone: "ok" | "warn" | "error" = "ok") {
    setMessage(text);
    setMessageTone(tone);
  }

  function updateProject(i: number, patch: Partial<Project>) {
    setProjects((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], ...patch };
      return next;
    });
  }

  function deleteProject(i: number) {
    const project = projects[i];
    if (!confirm(`Delete "${project.title}"?`)) return;
    setProjects(projects.filter((_, idx) => idx !== i));
    showMessage(`Removed "${project.title}" — save to apply.`, "ok");
  }

  function addProject() {
    const next = newProject(projects.length + 1);
    setProjects([...projects, next]);
    setExpandedId(next.id);
  }

  function reorder(from: number, dir: -1 | 1) {
    const next = moveItem(projects, from, from + dir).map((p, index) => ({
      ...p,
      sortOrder: index + 1,
    }));
    setProjects(next);
  }

  async function saveProjects() {
    const invalid = projects.filter((p) => !p.title.trim() || !p.src.trim());
    if (invalid.length > 0) {
      showMessage("Each project needs a title and cover image before saving.", "error");
      setExpandedId(invalid[0].id);
      return;
    }

    setSaving(true);
    setMessage("");

    const res = await secureJsonFetch("/api/admin/cms/projects", {
      method: "PUT",
      body: JSON.stringify({ projects }),
    });

    const data = (await res.json()) as {
      error?: string;
      details?: { fieldErrors?: Record<string, string[]> };
      count?: number;
    };

    setSaving(false);

    if (!res.ok) {
      const detail = data.details?.fieldErrors
        ? Object.entries(data.details.fieldErrors)
            .map(([k, v]) => `${k}: ${v?.join(", ")}`)
            .join(" · ")
        : "";
      showMessage([data.error ?? "Save failed", detail].filter(Boolean).join(" — "), "error");
      return;
    }

    showMessage(`Saved ${data.count ?? projects.length} project(s).`, "ok");
    router.refresh();
  }

  const messageClass =
    messageTone === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : messageTone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-950"
        : "border-ek-teal/30 bg-ek-teal/10 text-ek-navy";

  if (loading) {
    return (
      <p className="rounded-xl border border-ek-navy/10 bg-white p-8 text-center text-sm text-ek-muted">
        Loading gallery…
      </p>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      <div className="admin-gallery-intro rounded-2xl border border-ek-navy/8 bg-white p-5 shadow-sm sm:p-6">
        <p className="text-sm leading-relaxed text-ek-muted">
          Add, reorder, and edit every public gallery project here. Upload to Supabase or paste a
          stable URL — local paths like{" "}
          <code className="rounded bg-ek-gray px-1.5 py-0.5 text-ek-navy">/images/gallery/…</code>{" "}
          work too. Avoid Instagram links; they expire.
        </p>
        <dl className="mt-4 flex flex-wrap gap-3">
          <div className="admin-gallery-stat">
            <dt className="text-[10px] font-semibold tracking-[0.12em] text-ek-muted uppercase">
              Projects
            </dt>
            <dd className="text-xl font-black text-ek-navy">{stats.total}</dd>
          </div>
          <div className="admin-gallery-stat">
            <dt className="text-[10px] font-semibold tracking-[0.12em] text-ek-muted uppercase">
              Featured
            </dt>
            <dd className="text-xl font-black text-ek-navy">{stats.featured}</dd>
          </div>
          {stats.missingImage > 0 && (
            <div className="admin-gallery-stat admin-gallery-stat--warn">
              <dt className="text-[10px] font-semibold tracking-[0.12em] uppercase">Needs image</dt>
              <dd className="text-xl font-black">{stats.missingImage}</dd>
            </div>
          )}
        </dl>
      </div>

      {message && (
        <p className={`rounded-lg border px-4 py-3 text-sm ${messageClass}`} role="status">
          {message}
        </p>
      )}

      {projects.length === 0 ? (
        <div className="gallery-empty-state rounded-2xl border border-dashed border-ek-navy/15 bg-white p-10 text-center">
          <p className="text-sm font-medium text-ek-navy">No gallery projects yet</p>
          <p className="mt-2 text-sm text-ek-muted">
            Add your first project to populate the homepage gallery and /gallery page.
          </p>
          <button type="button" onClick={addProject} className="btn-primary mt-6 inline-flex">
            <Plus className="h-4 w-4" aria-hidden />
            Add first project
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {projects.map((project, i) => {
            const open = expandedId === project.id;
            const needsImage = !isValidGalleryImageSrc(project.src);

            return (
              <li
                key={project.id}
                className={`admin-project-card rounded-2xl border bg-white shadow-sm transition ${
                  needsImage ? "border-amber-200" : "border-ek-navy/10"
                }`}
              >
                <div className="flex items-stretch gap-0 sm:gap-2">
                  <div className="hidden flex-col items-center justify-center gap-1 border-r border-ek-navy/8 px-2 sm:flex">
                    <button
                      type="button"
                      disabled={i === 0}
                      onClick={() => reorder(i, -1)}
                      className="rounded p-1 text-ek-muted transition hover:bg-ek-gray hover:text-ek-navy disabled:opacity-30"
                      aria-label="Move up"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <GripVertical className="h-4 w-4 text-ek-muted/50" aria-hidden />
                    <button
                      type="button"
                      disabled={i === projects.length - 1}
                      onClick={() => reorder(i, 1)}
                      className="rounded p-1 text-ek-muted transition hover:bg-ek-gray hover:text-ek-navy disabled:opacity-30"
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="min-w-0 flex-1">
                    <button
                      type="button"
                      className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
                      onClick={() => setExpandedId(open ? null : project.id)}
                      aria-expanded={open}
                    >
                      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg border border-ek-navy/10 bg-ek-gray">
                        {isValidGalleryImageSrc(project.src) ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={project.src}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="gallery-image-empty absolute inset-0">
                            <span className="gallery-image-empty-label text-[9px]">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-semibold tracking-[0.14em] text-ek-teal uppercase">
                            {project.category}
                          </span>
                          {project.featured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-ek-teal/10 px-2 py-0.5 text-[9px] font-bold text-ek-teal uppercase">
                              <Star className="h-3 w-3" aria-hidden />
                              Featured
                            </span>
                          )}
                          {needsImage && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-bold text-amber-800 uppercase">
                              Needs cover
                            </span>
                          )}
                        </div>
                        <p className="mt-1 truncate text-base font-bold text-ek-navy">
                          {project.title}
                        </p>
                        <p className="mt-0.5 text-xs text-ek-muted">Order {i + 1}</p>
                      </div>
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-ek-muted transition ${open ? "rotate-180" : ""}`}
                        aria-hidden
                      />
                    </button>

                    {open && (
                      <div className="border-t border-ek-navy/8 px-4 pb-5 sm:px-5">
                        <div className="grid gap-3 pt-4 md:grid-cols-2">
                          <label className="block text-sm">
                            <span className="font-medium text-ek-navy">Title</span>
                            <input
                              className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                              value={project.title}
                              onChange={(e) => updateProject(i, { title: e.target.value })}
                            />
                          </label>
                          <label className="block text-sm">
                            <span className="font-medium text-ek-navy">Category</span>
                            <select
                              className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                              value={project.category}
                              onChange={(e) => updateProject(i, { category: e.target.value })}
                            >
                              {PROJECT_CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>
                                  {cat}
                                </option>
                              ))}
                            </select>
                          </label>
                          <label className="block text-sm md:col-span-2">
                            <span className="font-medium text-ek-navy">Description</span>
                            <textarea
                              rows={3}
                              className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                              value={project.description}
                              onChange={(e) => updateProject(i, { description: e.target.value })}
                            />
                          </label>
                          <label className="block text-sm">
                            <span className="font-medium text-ek-navy">Alt text</span>
                            <input
                              className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                              value={project.alt}
                              onChange={(e) => updateProject(i, { alt: e.target.value })}
                            />
                          </label>
                          <label className="block text-sm">
                            <span className="font-medium text-ek-navy">Object position</span>
                            <input
                              className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                              value={project.objectPosition ?? ""}
                              onChange={(e) => updateProject(i, { objectPosition: e.target.value })}
                            />
                          </label>
                          <ImageUploadField
                            label="Cover image"
                            value={project.src}
                            onChange={(url) => updateProject(i, { src: url })}
                          />
                          <label className="block text-sm md:col-span-2">
                            <span className="font-medium text-ek-navy">
                              Extra slides (one URL per line)
                            </span>
                            <textarea
                              rows={3}
                              className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 font-mono text-xs"
                              value={(project.images ?? []).join("\n")}
                              onChange={(e) =>
                                updateProject(i, {
                                  images: e.target.value
                                    .split(/\r?\n/)
                                    .map((l) => l.trim())
                                    .filter(Boolean),
                                })
                              }
                            />
                          </label>
                          <label className="block text-sm md:col-span-2">
                            <span className="font-medium text-ek-navy">
                              Highlights (one per line)
                            </span>
                            <textarea
                              rows={2}
                              className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                              value={(project.highlights ?? []).join("\n")}
                              onChange={(e) =>
                                updateProject(i, {
                                  highlights: e.target.value
                                    .split(/\r?\n/)
                                    .map((l) => l.trim())
                                    .filter(Boolean),
                                })
                              }
                            />
                          </label>
                          <label className="flex cursor-pointer items-center gap-2 text-sm md:col-span-2">
                            <input
                              type="checkbox"
                              checked={Boolean(project.featured)}
                              onChange={(e) => updateProject(i, { featured: e.target.checked })}
                              className="h-4 w-4 rounded border-ek-navy/20 text-ek-teal"
                            />
                            <Star className="h-4 w-4 text-ek-teal" aria-hidden />
                            <span className="font-medium text-ek-navy">
                              Show in homepage gallery (featured)
                            </span>
                          </label>
                          <div className="flex flex-wrap gap-3 md:col-span-2">
                            <a
                              href={`/gallery/${project.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-ek-teal uppercase hover:underline"
                            >
                              Preview
                              <ExternalLink className="h-3.5 w-3.5" aria-hidden />
                            </a>
                            <button
                              type="button"
                              onClick={() => deleteProject(i)}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 uppercase hover:underline"
                            >
                              <Trash2 className="h-3.5 w-3.5" aria-hidden />
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="admin-gallery-actions sticky bottom-4 z-20 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ek-navy/10 bg-white/95 p-4 shadow-lg backdrop-blur-md">
        <button
          type="button"
          className="inline-flex items-center gap-2 text-xs font-semibold text-ek-teal uppercase"
          onClick={addProject}
        >
          <Plus className="h-4 w-4" aria-hidden />
          Add project
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={saveProjects}
          className="btn-primary disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save gallery"}
        </button>
      </div>
    </div>
  );
}
