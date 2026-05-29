"use client";

import type { InstagramFeed, InstagramPost } from "@/lib/instagram/types";
import { secureJsonFetch } from "@/lib/security/client-fetch";
import { ExternalLink, Layers, RefreshCw, Search, Sparkles, Trash2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  initialFeed: InstagramFeed;
};

type SyncResponse = {
  synced?: number;
  failed?: string[];
  failedDetails?: { url: string; reason: string }[];
  error?: string;
  syncedAt?: string;
  discoverError?: string;
  method?: string;
  discovered?: number;
  posts?: {
    shortcode: string;
    permalink: string;
    caption?: string;
    title?: string;
    thumbnail: string;
    isCarousel?: boolean;
    imageCount?: number;
  }[];
};

function mapPostsFromApi(
  apiPosts: SyncResponse["posts"],
  syncedAt?: string,
): InstagramPost[] {
  if (!apiPosts?.length) return [];
  return apiPosts.map((p) => ({
    id: p.shortcode,
    shortcode: p.shortcode,
    permalink: p.permalink,
    caption: p.caption ?? "",
    title: p.title,
    images: p.thumbnail ? [p.thumbnail] : [],
    thumbnail: p.thumbnail,
    isCarousel: p.isCarousel ?? false,
    syncedAt: syncedAt ?? new Date().toISOString(),
  }));
}

function formatSyncMessage(data: SyncResponse, prefix: string): string {
  const parts = [prefix];
  if (data.failedDetails?.length) {
    parts.push(
      data.failedDetails.map((f) => `${f.url.split("/p/")[1]?.replace("/", "") ?? "post"}: ${f.reason}`).join(" · "),
    );
  } else if (data.failed?.length) {
    parts.push(`${data.failed.length} URL(s) failed`);
  }
  if (data.discoverError) parts.push(`Note: ${data.discoverError}`);
  return parts.filter(Boolean).join(" — ");
}

export function AdminInstagramManager({ initialFeed }: Props) {
  const router = useRouter();
  const [urlsText, setUrlsText] = useState("");
  const [posts, setPosts] = useState<InstagramPost[]>(initialFeed.posts);
  const [syncedAt, setSyncedAt] = useState(initialFeed.syncedAt);
  const [syncing, setSyncing] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageTone, setMessageTone] = useState<"ok" | "warn" | "error">("ok");

  useEffect(() => {
    fetch("/api/admin/instagram-urls", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data: { urls?: string[] }) => {
        if (data.urls?.length) setUrlsText(data.urls.join("\n"));
      })
      .catch(() => {});
  }, []);

  function showMessage(text: string, tone: "ok" | "warn" | "error" = "ok") {
    setMessage(text);
    setMessageTone(tone);
  }

  async function syncUrls() {
    const urls = urlsText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (!urls.length) {
      showMessage("Add at least one Instagram post URL.", "warn");
      return;
    }

    setSyncing(true);
    setMessage("");

    const res = await secureJsonFetch("/api/admin/instagram-sync", {
      method: "POST",
      body: JSON.stringify({ urls }),
    });

    let data: SyncResponse;
    try {
      data = (await res.json()) as SyncResponse;
    } catch {
      setSyncing(false);
      showMessage("Server error during sync — see Admin → Logs.", "error");
      return;
    }

    setSyncing(false);

    if (!res.ok) {
      showMessage(data.error ?? "Sync failed.", "error");
      return;
    }

    if (data.posts?.length) setPosts(mapPostsFromApi(data.posts, data.syncedAt));
    if (data.syncedAt) setSyncedAt(data.syncedAt);

    const tone = (data.failed?.length ?? 0) > 0 ? "warn" : "ok";
    showMessage(
      formatSyncMessage(
        data,
        `Synced ${data.synced ?? 0} post(s)${data.failed?.length ? ` · ${data.failed.length} failed` : ""}. Existing posts kept.`,
      ),
      tone,
    );
    router.refresh();
  }

  async function discoverAll() {
    setDiscovering(true);
    showMessage("Discovering posts from @ekconstructions…", "ok");

    const res = await secureJsonFetch("/api/admin/instagram-discover", { method: "POST" });

    let data: SyncResponse;
    try {
      data = (await res.json()) as SyncResponse;
    } catch {
      setDiscovering(false);
      showMessage("Server error during discover — check Admin → Logs.", "error");
      return;
    }

    setDiscovering(false);

    if (!res.ok) {
      showMessage(data.error ?? data.discoverError ?? "Discover failed.", "error");
      return;
    }

    if (data.posts?.length) setPosts(mapPostsFromApi(data.posts, data.syncedAt));
    if (data.syncedAt) setSyncedAt(data.syncedAt);

    const tone = (data.synced ?? 0) === 0 ? "warn" : "ok";
    showMessage(
      formatSyncMessage(
        data,
        `Synced ${data.synced ?? 0} post(s)${data.discovered ? ` from ${data.discovered} discovered` : ""}${data.method ? ` (${data.method})` : ""}.`,
      ),
      tone,
    );
    router.refresh();
  }

  async function deletePost(shortcode: string) {
    if (!confirm(`Remove "${shortcode}" from the site gallery?`)) return;

    setDeleting(shortcode);
    const res = await secureJsonFetch("/api/admin/instagram-delete", {
      method: "POST",
      body: JSON.stringify({ shortcode }),
    });

    const data = (await res.json()) as SyncResponse & { error?: string; remaining?: number };

    setDeleting(null);

    if (!res.ok) {
      showMessage(data.error ?? "Delete failed.", "error");
      return;
    }

    if (data.posts) setPosts(mapPostsFromApi(data.posts));
    showMessage(`Removed post. ${data.remaining ?? posts.length - 1} remaining in gallery.`, "ok");
    router.refresh();
  }

  const messageClass =
    messageTone === "error"
      ? "border-red-200 bg-red-50 text-red-900"
      : messageTone === "warn"
        ? "border-amber-200 bg-amber-50 text-amber-950"
        : "border-ek-teal/30 bg-ek-teal/10 text-ek-navy";

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="admin-card rounded-2xl border border-ek-teal/25 bg-gradient-to-br from-ek-teal/8 to-white p-6 shadow-sm">
          <div className="flex items-start gap-3">
            <Sparkles className="h-6 w-6 shrink-0 text-ek-teal" aria-hidden />
            <div>
              <h2 className="text-sm font-bold text-ek-navy uppercase">Discover all posts</h2>
              <p className="mt-2 text-sm text-ek-muted">
                Tries to load every public post from{" "}
                <a
                  href="https://www.instagram.com/ekconstructions/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-ek-teal hover:underline"
                >
                  @ekconstructions
                </a>
                . If blocked, paste URLs on the right — sync merges with existing posts.
              </p>
              <button
                type="button"
                disabled={discovering || syncing}
                onClick={discoverAll}
                className="btn-primary mt-4 disabled:opacity-60"
              >
                <Search className="h-4 w-4" aria-hidden />
                {discovering ? "Discovering…" : "Discover & sync profile"}
              </button>
            </div>
          </div>
        </section>

        <section className="admin-card rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-ek-navy uppercase">Manual post URLs</h2>
          <p className="mt-2 text-sm text-ek-muted">
            Paste links (with or without ?img_index=). Sync saves images to Supabase so they never expire.
          </p>
          <textarea
            rows={8}
            className="mt-3 w-full rounded-lg border border-ek-navy/15 px-3 py-2 font-mono text-xs"
            placeholder={`https://www.instagram.com/p/DXJsOgwDysY/\nhttps://www.instagram.com/p/DBvod18tyd8/`}
            value={urlsText}
            onChange={(e) => setUrlsText(e.target.value)}
          />
          <button
            type="button"
            disabled={syncing || discovering}
            onClick={syncUrls}
            className="btn-primary mt-4 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} aria-hidden />
            {syncing ? "Syncing…" : "Sync URLs"}
          </button>
        </section>
      </div>

      {message && (
        <p className={`rounded-lg border px-4 py-3 text-sm ${messageClass}`}>{message}</p>
      )}

      <section className="admin-card rounded-2xl border border-ek-navy/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ek-navy/8 px-6 py-4">
          <div>
            <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">
              Gallery posts ({posts.length})
            </h2>
            {syncedAt && (
              <p className="mt-1 text-xs text-ek-muted">
                Last sync: {new Date(syncedAt).toLocaleString("en-AU")}
              </p>
            )}
          </div>
          <p className="text-xs text-ek-muted">Delete removes from site · Images saved to Supabase Storage</p>
        </div>

        {posts.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-ek-muted">
            No posts yet. Paste a URL and click Sync URLs.
          </p>
        ) : (
          <ul className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <li
                key={post.id}
                className="overflow-hidden rounded-xl border border-ek-navy/10 bg-ek-gray/30"
              >
                <div className="relative aspect-square bg-ek-gray">
                  <Image
                    src={post.thumbnail}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="200px"
                    unoptimized
                  />
                  {post.isCarousel && (
                    <span className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[9px] font-bold text-white">
                      <Layers className="h-3 w-3" aria-hidden />
                      {post.images.length} slides
                    </span>
                  )}
                  <button
                    type="button"
                    disabled={deleting === post.shortcode}
                    onClick={() => deletePost(post.shortcode)}
                    className="absolute top-2 left-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600/90 text-white shadow-md transition hover:bg-red-700 disabled:opacity-60"
                    title="Remove from gallery"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
                <div className="space-y-2 p-3">
                  <p className="line-clamp-2 text-sm font-bold text-ek-navy">
                    {post.title || post.caption?.split("\n")[0] || post.shortcode}
                  </p>
                  {post.caption && (
                    <p className="line-clamp-3 text-xs leading-relaxed text-ek-muted">{post.caption}</p>
                  )}
                  {!post.caption && (
                    <p className="text-xs text-ek-orange">No caption yet</p>
                  )}
                  <p className="truncate font-mono text-[10px] text-ek-muted">{post.shortcode}</p>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-ek-teal hover:underline"
                    >
                      Instagram
                      <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                    <a
                      href={`/gallery/ig-${post.shortcode}`}
                      className="text-xs font-semibold text-ek-navy hover:text-ek-teal"
                    >
                      View on site →
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
