"use client";

import type { CmsData } from "@/lib/cms/types";
import { secureJsonFetch } from "@/lib/security/client-fetch";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminSiteEditor() {
  const router = useRouter();
  const [data, setData] = useState<CmsData | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/cms", { credentials: "same-origin" })
      .then((r) => r.json())
      .then(setData)
      .catch(() => setMessage("Failed to load content"));
  }, []);

  async function save(partial: Partial<CmsData>) {
    if (!data) return;
    setSaving(true);
    setMessage("");
    const next = { ...data, ...partial };
    const res = await secureJsonFetch("/api/admin/cms", {
      method: "PUT",
      body: JSON.stringify(next),
    });
    setSaving(false);
    if (res.ok) {
      setData(next);
      setMessage("Saved — refresh the public site to see changes.");
      router.refresh();
    } else {
      setMessage("Save failed. Check all required fields.");
    }
  }

  if (!data) {
    return <p className="text-sm text-ek-muted">Loading content…</p>;
  }

  const { site } = data;

  return (
    <div className="space-y-8">
      {message && (
        <p className="rounded-lg border border-ek-teal/30 bg-ek-teal/10 px-4 py-3 text-sm text-ek-navy">
          {message}
        </p>
      )}

      <section className="rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">Hero & branding</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {(
            [
              ["name", "Business name"],
              ["headline", "Headline line 1"],
              ["headlineAccent", "Headline accent"],
              ["tagline", "Tagline"],
              ["contactEmail", "Contact email"],
              ["contactPhone", "Phone"],
              ["projectsDelivered", "Projects stat (e.g. 500+)"],
              ["abn", "ABN"],
              ["instagramHandle", "Instagram handle"],
              ["instagramUrl", "Instagram URL"],
              ["locationArea", "Service area"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block text-sm">
              <span className="font-medium text-ek-navy">{label}</span>
              <input
                className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                value={site[key]}
                onChange={(e) =>
                  setData({ ...data, site: { ...site, [key]: e.target.value } })
                }
              />
            </label>
          ))}
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => save({ site: data.site })}
          className="btn-primary mt-6 disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save hero & branding"}
        </button>
      </section>

      <section className="rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">About paragraphs</h2>
        {site.aboutParagraphs.map((p, i) => (
          <textarea
            key={i}
            rows={3}
            className="mt-3 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
            value={p}
            onChange={(e) => {
              const aboutParagraphs = [...site.aboutParagraphs];
              aboutParagraphs[i] = e.target.value;
              setData({ ...data, site: { ...site, aboutParagraphs } });
            }}
          />
        ))}
        <button
          type="button"
          className="mt-3 text-xs font-semibold text-ek-teal uppercase"
          onClick={() =>
            setData({
              ...data,
              site: { ...site, aboutParagraphs: [...site.aboutParagraphs, ""] },
            })
          }
        >
          + Add paragraph
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => save({ site: data.site })}
          className="btn-primary mt-4 block disabled:opacity-60"
        >
          Save about
        </button>
      </section>

      <section className="rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">Services</h2>
        <div className="mt-4 space-y-4">
          {data.services.map((service, i) => (
            <div key={service.id} className="grid gap-2 rounded-xl bg-ek-gray/60 p-4 md:grid-cols-2">
              <input
                className="rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                value={service.title}
                placeholder="Title"
                onChange={(e) => {
                  const services = [...data.services];
                  services[i] = { ...service, title: e.target.value };
                  setData({ ...data, services });
                }}
              />
              <input
                className="rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                value={service.icon}
                placeholder="Icon key (window, balustrade…)"
                onChange={(e) => {
                  const services = [...data.services];
                  services[i] = { ...service, icon: e.target.value };
                  setData({ ...data, services });
                }}
              />
              <textarea
                className="md:col-span-2 rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                rows={2}
                value={service.description}
                onChange={(e) => {
                  const services = [...data.services];
                  services[i] = { ...service, description: e.target.value };
                  setData({ ...data, services });
                }}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => save({ services: data.services })}
          className="btn-primary mt-4 disabled:opacity-60"
        >
          Save services
        </button>
      </section>

      <section className="rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">Materials list</h2>
        {data.materials.map((m, i) => (
          <input
            key={i}
            className="mt-2 w-full rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
            value={m}
            onChange={(e) => {
              const materials = [...data.materials];
              materials[i] = e.target.value;
              setData({ ...data, materials });
            }}
          />
        ))}
        <button
          type="button"
          className="mt-3 text-xs font-semibold text-ek-teal uppercase"
          onClick={() => setData({ ...data, materials: [...data.materials, ""] })}
        >
          + Add material
        </button>
        <button
          type="button"
          disabled={saving}
          onClick={() => save({ materials: data.materials.filter(Boolean) })}
          className="btn-primary mt-4 block disabled:opacity-60"
        >
          Save materials
        </button>
      </section>

      <section className="rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">Why choose us</h2>
        <div className="mt-4 space-y-4">
          {data.whyChooseUs.map((item, i) => (
            <div key={i} className="grid gap-2 rounded-xl bg-ek-gray/60 p-4 md:grid-cols-2">
              <input
                className="rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                value={item.title}
                onChange={(e) => {
                  const whyChooseUs = [...data.whyChooseUs];
                  whyChooseUs[i] = { ...item, title: e.target.value };
                  setData({ ...data, whyChooseUs });
                }}
              />
              <input
                className="rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                value={item.icon}
                placeholder="Icon key"
                onChange={(e) => {
                  const whyChooseUs = [...data.whyChooseUs];
                  whyChooseUs[i] = { ...item, icon: e.target.value };
                  setData({ ...data, whyChooseUs });
                }}
              />
              <textarea
                className="md:col-span-2 rounded-lg border border-ek-navy/15 px-3 py-2 text-sm"
                rows={2}
                value={item.description}
                onChange={(e) => {
                  const whyChooseUs = [...data.whyChooseUs];
                  whyChooseUs[i] = { ...item, description: e.target.value };
                  setData({ ...data, whyChooseUs });
                }}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          disabled={saving}
          onClick={() => save({ whyChooseUs: data.whyChooseUs })}
          className="btn-primary mt-4 disabled:opacity-60"
        >
          Save why choose us
        </button>
      </section>
    </div>
  );
}
