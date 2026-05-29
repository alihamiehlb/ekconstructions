"use client";

import { secureJsonFetch } from "@/lib/security/client-fetch";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AdminInstagramSync() {
  const router = useRouter();
  const [urlsText, setUrlsText] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/instagram-urls", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data: { urls?: string[] }) => {
        if (data.urls?.length) setUrlsText(data.urls.join("\n"));
      })
      .catch(() => {});
  }, []);

  async function sync() {
    const urls = urlsText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (!urls.length) {
      setMessage("Add at least one Instagram post URL.");
      return;
    }

    setSyncing(true);
    setMessage("");

    const res = await secureJsonFetch("/api/admin/instagram-sync", {
      method: "POST",
      body: JSON.stringify({ urls }),
    });

    const data = (await res.json()) as {
      synced?: number;
      failed?: string[];
      error?: string;
    };

    setSyncing(false);

    if (!res.ok) {
      setMessage(data.error ?? "Sync failed.");
      return;
    }

    const failed = data.failed?.length ?? 0;
    setMessage(
      `Synced ${data.synced ?? 0} post(s)${failed ? ` — ${failed} failed (check URLs are public).` : "."} Gallery and homepage updated.`,
    );
    router.refresh();
  }

  return (
    <div className="space-y-6 rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-sm font-bold text-ek-navy uppercase">Post URLs</h2>
        <p className="mt-2 text-sm text-ek-muted">
          Paste links from{" "}
          <a
            href="https://www.instagram.com/ekconstructions/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-ek-teal hover:underline"
          >
            @ekconstructions
          </a>{" "}
          (posts or reels). We fetch image CDN links — carousel posts include all slides.
        </p>
      </div>

      <label className="block text-sm">
        <span className="font-medium text-ek-navy">One URL per line</span>
        <textarea
          rows={12}
          className="mt-2 w-full rounded-lg border border-ek-navy/15 px-3 py-2 font-mono text-xs"
          placeholder={`https://www.instagram.com/p/SHORTCODE/\nhttps://www.instagram.com/reel/SHORTCODE/`}
          value={urlsText}
          onChange={(e) => setUrlsText(e.target.value)}
        />
      </label>

      {message && (
        <p className="rounded-lg border border-ek-teal/30 bg-ek-teal/10 px-4 py-3 text-sm text-ek-navy">
          {message}
        </p>
      )}

      <button
        type="button"
        disabled={syncing}
        onClick={sync}
        className="btn-primary disabled:opacity-60"
      >
        {syncing ? "Syncing…" : "Sync Instagram → gallery"}
      </button>
    </div>
  );
}
