"use client";

import type { Project } from "@/content/projects";
import type { CmsData } from "@/lib/cms/types";
import { secureJsonFetch } from "@/lib/security/client-fetch";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminProjectsEditor() {
  const router = useRouter();
  const [data, setData] = useState<CmsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/cms", { credentials: "same-origin" })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setMessage("Failed to load projects"));
  }, []);

  function updateProject(i: number, patch: Partial<Project>) {
    if (!data) return;
    const projects = [...data.projects];
    projects[i] = { ...projects[i], ...patch };
    setData({ ...data, projects });
  }

  async function saveProjects() {
    if (!data) return;
    setSaving(true);
    setMessage("");
    const res = await secureJsonFetch("/api/admin/cms", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (res.ok) {
      setMessage("Projects saved.");
      router.refresh();
    } else {
      setMessage("Save failed — check image paths and required fields.");
    }
  }

  if (!data) return <p className="text-sm text-ek-muted">Loading projects…</p>;

  return (
    <div className="space-y-6">
      {message && (
        <p className="rounded-lg border border-ek-teal/30 bg-ek-teal/10 px-4 py-3 text-sm text-ek-navy">
          {message}
        </p>
      )}

      <p className="text-sm text-ek-muted">
        Image paths are relative to <code className="text-ek-navy">/public</code> (e.g.{" "}
        <code className="text-ek-navy">/images/gallery/gallery-stairs.jpg</code>). Drop Instagram
        photos in <code className="text-ek-navy">/public/instagram/</code> to auto-override on the
        live site.
      </p>

      {data.projects.map((project, i) => (
        <section
          key={project.id}
          className="rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm"
        >
          <h2 className="text-sm font-bold text-ek-navy uppercase">Project {i + 1}</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {(
              [
                ["id", "ID"],
                ["title", "Title"],
                ["category", "Category"],
                ["src", "Image path"],
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
            <label className="block text-sm md:col-span-2">
              <span className="font-medium text-ek-navy">Description</span>
              <textarea
                rows={3}
                className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                value={project.description}
                onChange={(e) => updateProject(i, { description: e.target.value })}
              />
            </label>
            <label className="block text-sm md:col-span-2">
              <span className="font-medium text-ek-navy">Highlights (comma separated)</span>
              <input
                className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                value={(project.highlights ?? []).join(", ")}
                onChange={(e) =>
                  updateProject(i, {
                    highlights: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  })
                }
              />
            </label>
          </div>
        </section>
      ))}

      <button
        type="button"
        className="text-xs font-semibold text-ek-teal uppercase"
        onClick={() =>
          setData({
            ...data,
            projects: [
              ...data.projects,
              {
                id: `project-${Date.now()}`,
                title: "New project",
                category: "Glass Balustrade",
                src: "/images/gallery/gallery-stairs.jpg",
                alt: "Project photo",
                description: "Project description.",
                highlights: [],
              },
            ],
          })
        }
      >
        + Add project
      </button>

      <button
        type="button"
        disabled={saving}
        onClick={saveProjects}
        className="btn-primary block disabled:opacity-60"
      >
        {saving ? "Saving…" : "Save all projects"}
      </button>
    </div>
  );
}
