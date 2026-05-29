import { AdminNav } from "@/components/admin/AdminNav";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSettingsPanel } from "@/components/admin/AdminSettingsPanel";
import { getAdminInsights } from "@/lib/admin/insights";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  await requireAdmin();
  const insights = await getAdminInsights();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ekconstructions.vercel.app";

  return (
    <div className="section-pad py-6 sm:py-10">
      <AdminPageHeader
        title="Settings"
        description="Instagram session setup, environment variables, and integration guides."
      />
      <AdminNav />
      <div className="mt-8">
        <AdminSettingsPanel
          sessionConfigured={insights.instagram.sessionConfigured}
          siteUrl={siteUrl}
        />
      </div>
    </div>
  );
}
