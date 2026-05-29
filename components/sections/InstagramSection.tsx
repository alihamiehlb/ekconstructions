import { InstagramFeedGrid } from "@/components/sections/InstagramFeedGrid";
import { SectionReveal } from "@/components/ui/SectionReveal";
import { readCms } from "@/lib/cms";
import { buildSiteContext } from "@/lib/cms/public-site";
import { readInstagramFeed } from "@/lib/instagram/feed";
import { Instagram } from "lucide-react";

export async function InstagramSection() {
  const cms = await readCms();
  const site = buildSiteContext(cms);
  const feed = await readInstagramFeed();
  const posts = feed.posts.filter((p) => p.images.length > 0).slice(0, 8);

  return (
    <section className="section-pad border-t border-ek-navy/8 bg-ek-gray/40 py-16 md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-4xl text-center">
          <SectionReveal>
            <span className="inline-flex items-center gap-2 rounded-full border border-ek-teal/20 bg-white px-4 py-1.5 text-[10px] font-bold tracking-[0.2em] text-ek-teal uppercase">
              <Instagram className="h-3.5 w-3.5" aria-hidden />
              Follow us
            </span>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-ek-navy uppercase md:text-3xl">
              Latest on Instagram
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-ek-muted">
              Real project photos from{" "}
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-ek-teal hover:underline"
              >
                @{site.instagram.handle}
              </a>
              {feed.syncedAt
                ? ` — synced ${new Date(feed.syncedAt).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}`
                : ""}
              .
            </p>
          </SectionReveal>
        </div>

        <InstagramFeedGrid posts={posts} />
      </div>
    </section>
  );
}
