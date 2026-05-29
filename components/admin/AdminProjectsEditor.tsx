"use client";

import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { Project } from "@/content/projects";
import { secureJsonFetch } from "@/lib/security/client-fetch";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PLACEHOLDER_PREFIX = "/images/gallery/";

function isPlaceholder(project: Project): boolean {
  return project.src.startsWith(PLACEHOLDER_PREFIX);
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
    if (!confirm("Remove all CMS projects? Instagram gallery posts are managed separately.")) return;
    setProjects([]);
    showMessage("All CMS projects removed — click Save to persist.", "ok");
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
        ? "border-amber-200 bg-amber-50 text-amber-950"
        : "border-ek-teal/30 bg-ek-teal/10 text-ek-navy";

  return (
    <div className="space-y-6">
      <div className="admin-card rounded-2xl border border-ek-teal/20 bg-gradient-to-br from-ek-teal/5 to-white p-5">
        <p className="text-sm leading-relaxed text-ek-muted">
          The public gallery is powered by{" "}
          <Link href="/admin/instagram" className="font-semibold text-ek-teal hover:underline">
            Admin → Instagram
          </Link>
          . Use this page only for extra manual CMS projects (optional).
        </p>
      </div>

      {hiddenExamples > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-950">
            {hiddenExamples} example project{hiddenExamples === 1 ? "" : "s"} still stored
            (placeholder images). They are hidden from this list but can block saves on the old
            editor.
          </p>
          <button
            type="button"
            disabled={saving}
            onClick={removeExamples}
            className="rounded-lg bg-amber-900 px-4 py-2 text-xs font-bold tracking-wide text-white uppercase disabled:opacity-60"
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
          No CMS projects — gallery shows Instagram posts only.{" "}
          <Link href="/admin/instagram" className="font-semibold text-ek-teal hover:underline">
            Sync Instagram →
          </Link>
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
              {(
                [
                  ["id", "ID"],
                  ["title", "Title"],
                  ["category", "Category"],
                  ["alt", "Alt text"],
                  ["objectPosition", "Object position (CSS)"],
                ] as const
              ).map(([key, label]) => (
                <label key={key} className="block text-sm">
                  <span className="font-medium text-ek-navy">{label}</span>
                  <input
                    className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                    value={project[key] ?? ""}
                    onChange={(e) => updateProject(i, { [key]: e.target.value })}
                  />
                </label>
              ))}
              <ImageUploadField
                label="Cover image"
                value={project.src}
                onChange={(url) => updateProject(i, { src: url })}
              />
              <label className="block text-sm md:col-span-2">
                <span className="font-medium text-ek-navy">Description</span>
                <textarea
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                  value={project.description}
                  onChange={(e) => updateProject(i, { description: e.target.value })}
                />
              </label>
            </div>
          </section>
        ))
      )}

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          className="text-xs font-semibold text-ek-teal uppercase"
          onClick={() =>
            setProjects([
              ...projects,
              {
                id: `project-${Date.now()}`,
                title: "New project",
                category: "Recent Work",
                src: "",
                alt: "Project photo",
                description: "Project description.",
                highlights: [],
              },
            ])
          }
        >
          + Add CMS project
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
        {saving ? "Saving…" : "Save projects"}
      </button>
    </div>
  );
}
