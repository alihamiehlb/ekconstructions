"use client";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { Project } from "@/content/projects";
import {
  DEFAULT_PROJECT_CATEGORY,
  PROJECT_CATEGORIES,
} from "@/lib/project-categories";
import { secureJsonFetch } from "@/lib/security/client-fetch";
import { Star, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PLACEHOLDER_PREFIX = "/images/gallery/";

function isPlaceholder(project: Project): boolean {
  return project.src.startsWith(PLACEHOLDER_PREFIX);
}

function newProject(): Project {
  return {
    id: `project-${Date.now()}`,
    title: "New project",
    category: DEFAULT_PROJECT_CATEGORY,
    src: "",
    alt: "Project photo",
    description: "Project description.",
    featured: false,
    sortOrder: 99,
    highlights: [],
  };
}

export function AdminProjectsEditor() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [hiddenExamples, setHiddenExamples] = useState(0);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"ok" | "warn" | "error">("ok");

  useEffect(() => {
    fetch("/api/admin/cms/projects", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data: { projects?: Project[]; hiddenExampleCount?: number }) => {
        const raw = data.projects ?? [];
        const list = raw.filter((p) => !isPlaceholder(p));
        setProjects(list);
        setHiddenExamples(
          data.hiddenExampleCount ?? raw.filter((p) => isPlaceholder(p)).length,
        );
      })
      .catch(() => showMessage("Failed to load projects", "error"));
  }, []);

  function showMessage(text: string, tone: "ok" | "warn" | "error" = "ok") {
    setMessage(text);
    setMessageTone(tone);
  }

  function updateProject(i: number, patch: Partial<Project>) {
    const next = [...projects];
    next[i] = { ...next[i], ...patch };
    setProjects(next);
  }

  function deleteProject(i: number) {
    const project = projects[i];
    if (!confirm(`Delete project "${project.title}"?`)) return;
    setProjects(projects.filter((_, idx) => idx !== i));
    showMessage(`Removed "${project.title}" — click Save to persist.`, "ok");
  }

  function clearAll() {
    if (!projects.length) return;
    if (!confirm("Remove all gallery projects?")) return;
    setProjects([]);
    showMessage("All projects removed — click Save to persist.", "ok");
  }

  async function persistProjects(next: Project[], successText: string) {
    setSaving(true);
    setMessage("");

    const res = await secureJsonFetch("/api/admin/cms/projects", {
      method: "PUT",
      body: JSON.stringify({ projects: next }),
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
      showMessage(
        [data.error ?? "Save failed", detail].filter(Boolean).join(" — "),
        "error",
      );
      return false;
    }

    setProjects(next);
    setHiddenExamples(0);
    showMessage(successText, "ok");
    router.refresh();
    return true;
  }

  async function removeExamples() {
    if (!hiddenExamples) return;
    if (
      !confirm(
        `Remove ${hiddenExamples} example project(s) from the database? This cannot be undone.`,
      )
    ) {
      return;
    }
    await persistProjects(projects, `Removed ${hiddenExamples} example project(s).`);
  }

  async function saveProjects() {
    await persistProjects(projects, `Saved ${projects.length} project(s).`);
  }

  const messageClass =
    messageTone === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : messageTone === "warn"
        ? "border-ek-teal/40 bg-ek-teal/5 text-ek-navy"
        : "border-ek-teal/30 bg-ek-teal/10 text-ek-navy";

  return (
    <div className="space-y-6">
      <div className="admin-card rounded-2xl border border-ek-teal/20 bg-gradient-to-br from-ek-teal/5 to-white p-5">
        <p className="text-sm leading-relaxed text-ek-muted">
          Manage the public gallery here. Paste image URLs (Supabase, CDN, or{" "}
          <code className="text-ek-navy">/images/...</code> paths), pick a category, and mark
          projects as featured for the homepage spotlight.
        </p>
      </div>

      {hiddenExamples > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-ek-teal/30 bg-ek-teal/5 px-4 py-3">
          <p className="text-sm text-ek-navy">
            {hiddenExamples} example project{hiddenExamples === 1 ? "" : "s"} still stored
            (placeholder images).
          </p>
          <button
            type="button"
            disabled={saving}
            onClick={removeExamples}
            className="rounded-lg bg-ek-teal px-4 py-2 text-xs font-bold tracking-wide text-white uppercase disabled:opacity-60"
          >
            Remove examples
          </button>
        </div>
      )}

      {message && (
        <p className={`rounded-lg border px-4 py-3 text-sm ${messageClass}`}>{message}</p>
      )}

      {projects.length === 0 ? (
        <p className="rounded-xl border border-ek-navy/10 bg-white p-8 text-center text-sm text-ek-muted">
          No gallery projects yet. Add your first project below.
        </p>
      ) : (
        projects.map((project, i) => (
          <section
            key={project.id}
            className="relative rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-bold text-ek-navy uppercase">Project {i + 1}</h2>
              <button
                type="button"
                onClick={() => deleteProject(i)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-[10px] font-bold tracking-wide text-red-700 uppercase transition hover:bg-red-100"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden />
                Delete
              </button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block text-sm">
                <span className="font-medium text-ek-navy">ID</span>
                <input
                  className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                  value={project.id}
                  onChange={(e) => updateProject(i, { id: e.target.value })}
                />
              </label>
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
              <label className="block text-sm">
                <span className="font-medium text-ek-navy">Sort order</span>
                <input
                  type="number"
                  min={0}
                  max={9999}
                  className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                  value={project.sortOrder ?? 99}
                  onChange={(e) =>
                    updateProject(i, { sortOrder: Number.parseInt(e.target.value, 10) || 0 })
                  }
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
                <span className="font-medium text-ek-navy">Object position (CSS)</span>
                <input
                  className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                  value={project.objectPosition ?? ""}
                  onChange={(e) => updateProject(i, { objectPosition: e.target.value })}
                  placeholder="center"
                />
              </label>
              <ImageUploadField
                label="Cover image URL"
                value={project.src}
                onChange={(url) => updateProject(i, { src: url })}
              />
              <label className="block text-sm md:col-span-2">
                <span className="font-medium text-ek-navy">
                  Extra slides (one image URL per line)
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
                  placeholder="https://example.com/photo-2.jpg"
                />
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
              <label className="flex cursor-pointer items-center gap-2 text-sm md:col-span-2">
                <input
                  type="checkbox"
                  checked={Boolean(project.featured)}
                  onChange={(e) => updateProject(i, { featured: e.target.checked })}
                  className="h-4 w-4 rounded border-ek-navy/20 text-ek-teal"
                />
                <Star className="h-4 w-4 text-ek-teal" aria-hidden />
                <span className="font-medium text-ek-navy">Featured on homepage spotlight</span>
              </label>
            </div>
          </section>
        ))
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="text-xs font-semibold text-ek-teal uppercase"
          onClick={() => setProjects([...projects, newProject()])}
        >
          + Add project
        </button>
        {projects.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-red-600 uppercase hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      <button
        type="button"
        disabled={saving}
        onClick={saveProjects}
        className="btn-primary block disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save gallery"}
      </button>
    </div>
  );
}
