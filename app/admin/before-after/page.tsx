import { AdminBeforeAfterEditor } from "@/components/admin/AdminBeforeAfterEditor";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Before & After — Admin" };

export default async function AdminBeforeAfterPage() {
  await requireAdmin();

  return (
    <div className="admin-content space-y-6">
      <AdminPageHeader
        title="Before & After"
        description="Manage the animated comparison slider on the homepage. Upload before and after photos for each project."
      />
      <AdminNav />
      <AdminBeforeAfterEditor />
    </div>
  );
}
