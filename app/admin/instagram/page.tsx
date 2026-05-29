import { AdminInstagramManager } from "@/components/admin/AdminInstagramManager";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { requireAdmin } from "@/lib/auth";
import { readInstagramFeed } from "@/lib/instagram/feed";
import { isSupabaseFeedConfigured } from "@/lib/instagram/supabase-feed";

export const metadata = { title: "Instagram" };

export default async function AdminInstagramPage() {
  await requireAdmin();
  const feed = await readInstagramFeed();
  const storage = isSupabaseFeedConfigured() ? "Supabase" : "File only";

  return (
    <div className="section-pad py-6 sm:py-10">
      <AdminPageHeader
        title="Instagram gallery"
        badge={storage}
        description="Sync @ekconstructions into the site gallery. Carousel posts keep all slides together on one project page."
      />
      <AdminNav />
      <div className="mt-8">
        <AdminInstagramManager initialFeed={feed} />
      </div>
    </div>
  );
}
