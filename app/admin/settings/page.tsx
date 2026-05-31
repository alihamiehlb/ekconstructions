import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminSettingsPanel } from "@/components/admin/AdminSettingsPanel";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Settings" };

export default async function AdminSettingsPage() {
  await requireAdmin();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ekconstructions.vercel.app";

  return (
    <div className="section-pad py-6 sm:py-10">
      <AdminPageHeader
        title="Settings"
        description="Site URL, environment variables, and gallery workflow."
      />
      <div className="mt-8">
        <AdminSettingsPanel siteUrl={siteUrl} />
      </div>
    </div>
  );
}
