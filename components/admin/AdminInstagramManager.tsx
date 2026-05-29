"use client";

import type { InstagramFeed, InstagramPost } from "@/lib/instagram/types";
import { secureJsonFetch } from "@/lib/security/client-fetch";
import { ExternalLink, Layers, RefreshCw, Search, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Props = {
  initialFeed: InstagramFeed;
};

export function AdminInstagramManager({ initialFeed }: Props) {
  const router = useRouter();
  const [urlsText, setUrlsText] = useState("");
  const [posts, setPosts] = useState<InstagramPost[]>(initialFeed.posts);
  const [syncedAt, setSyncedAt] = useState(initialFeed.syncedAt);
  const [syncing, setSyncing] = useState(false);
  const [discovering, setDiscovering] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/instagram-urls", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((data: { urls?: string[] }) => {
        if (data.urls?.length) setUrlsText(data.urls.join("\n"));
      })
      .catch(() => {});
  }, []);

  async function syncUrls() {
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
      syncedAt?: string;
      posts?: {
        shortcode: string;
        permalink: string;
        caption?: string;
        title?: string;
        thumbnail: string;
        imageCount?: number;
        isCarousel?: boolean;
      }[];
    };

    setSyncing(false);

    if (!res.ok) {
      setMessage(data.error ?? "Sync failed.");
      return;
    }

    if (data.posts?.length) {
      setPosts(
        data.posts.map((p) => ({
          id: p.shortcode,
          shortcode: p.shortcode,
          permalink: p.permalink,
          caption: p.caption ?? "",
          title: p.title,
          images: [p.thumbnail],
          thumbnail: p.thumbnail,
          isCarousel: p.isCarousel ?? false,
          syncedAt: data.syncedAt ?? new Date().toISOString(),
        })),
      );
    }

    setMessage(
      `Synced ${data.synced ?? 0} post(s)${data.failed?.length ? ` · ${data.failed.length} failed` : ""}. Carousel slides are grouped per post.`,
    );
    if (data.syncedAt) setSyncedAt(data.syncedAt);
    router.refresh();
  }

  async function discoverAll() {
    setDiscovering(true);
    setMessage("Discovering posts from @ekconstructions…");

    const res = await secureJsonFetch("/api/admin/instagram-discover", { method: "POST" });
    const data = (await res.json()) as {
      synced?: number;
      discovered?: number;
      discoverError?: string;
      method?: string;
      posts?: {
        shortcode: string;
        permalink: string;
        caption?: string;
        title?: string;
        imageCount: number;
        isCarousel: boolean;
        thumbnail: string;
      }[];
      error?: string;
    };

    setDiscovering(false);

    if (!res.ok) {
      setMessage(data.error ?? "Discover failed.");
      return;
    }

    if (data.posts) {
      setPosts(
        data.posts.map((p) => ({
          id: p.shortcode,
          shortcode: p.shortcode,
          permalink: p.permalink,
          caption: p.caption ?? "",
          title: p.title,
          images: [p.thumbnail],
          thumbnail: p.thumbnail,
          isCarousel: p.isCarousel,
          syncedAt: new Date().toISOString(),
        })),
      );
    }

    const parts = [
      `Synced ${data.synced ?? 0} post(s)`,
      data.discovered ? `from ${data.discovered} discovered links` : "",
      data.method ? `(${data.method})` : "",
    ].filter(Boolean);

    setMessage(
      `${parts.join(" ")}.${data.discoverError ? ` Note: ${data.discoverError}` : ""}`,
    );
    router.refresh();
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-ek-teal/25 bg-gradient-to-br from-ek-teal/8 to-white p-6 shadow-sm">
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
                . If blocked, add{" "}
                <code className="rounded bg-white px-1 text-xs">INSTAGRAM_SESSION_ID</code> in
                Vercel env (from browser cookies while logged in).
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

        <section className="rounded-2xl border border-ek-navy/10 bg-white p-6 shadow-sm">
          <h2 className="text-sm font-bold text-ek-navy uppercase">Manual post URLs</h2>
          <p className="mt-2 text-sm text-ek-muted">
            Paste links (posts or reels). Multiple images in one post stay together as one gallery
            project with slides.
          </p>
          <textarea
            rows={8}
            className="mt-3 w-full rounded-lg border border-ek-navy/15 px-3 py-2 font-mono text-xs"
            placeholder={`https://www.instagram.com/p/DXJsOgwDysY/\nhttps://www.instagram.com/p/DW3rM9qmE-K/`}
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
        <p className="rounded-lg border border-ek-teal/30 bg-ek-teal/10 px-4 py-3 text-sm text-ek-navy">
          {message}
        </p>
      )}

      <section className="rounded-2xl border border-ek-navy/10 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ek-navy/8 px-6 py-4">
          <div>
            <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">
              Synced posts ({posts.length})
            </h2>
            {syncedAt && (
              <p className="mt-1 text-xs text-ek-muted">
                Last sync: {new Date(syncedAt).toLocaleString("en-AU")}
              </p>
            )}
          </div>
          <p className="text-xs text-ek-muted">
            Stored in Supabase + site gallery · direct Instagram CDN links
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="px-6 py-12 text-center text-sm text-ek-muted">
            No posts synced yet. Use Discover or paste URLs above.
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
                </div>
                <div className="space-y-2 p-3">
                  <p className="line-clamp-2 text-sm font-bold text-ek-navy">
                    {post.title || post.caption?.split("\n")[0] || post.shortcode}
                  </p>
                  {post.caption && (
                    <p className="line-clamp-3 text-xs leading-relaxed text-ek-muted">{post.caption}</p>
                  )}
                  {!post.caption && (
                    <p className="text-xs text-ek-orange">
                      No caption — add INSTAGRAM_SESSION_ID or edit in post meta.
                    </p>
                  )}
                  <p className="truncate font-mono text-[10px] text-ek-muted">{post.shortcode}</p>
                  <a
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs font-semibold text-ek-teal hover:underline"
                  >
                    View on Instagram
                    <ExternalLink className="h-3 w-3" aria-hidden />
                  </a>
                  <a
                    href={`/gallery/ig-${post.shortcode}`}
                    className="block text-xs font-semibold text-ek-navy hover:text-ek-teal"
                  >
                    Open on site →
                  </a>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
