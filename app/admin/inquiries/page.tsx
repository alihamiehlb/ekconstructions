import { AdminInquiriesManager } from "@/components/admin/AdminInquiriesManager";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { readCms } from "@/lib/cms";
import { requireAdmin } from "@/lib/auth";
import { listEnquiries } from "@/lib/store/enquiries-admin";

export const metadata = { title: "Enquiries" };

export default async function AdminInquiriesPage() {
  await requireAdmin();
  const [enquiries, cms] = await Promise.all([listEnquiries(200), readCms()]);

  return (
    <div className="section-pad py-6 sm:py-10">
      <AdminPageHeader
        title="Enquiries"
        description="Manage contact form leads, reply via Gmail, track status, and create quotes."
      />
      <AdminNav />
      <div className="mt-8">
        <AdminInquiriesManager
          initialEnquiries={enquiries}
          contactEmail={cms.site.contactEmail}
        />
      </div>
    </div>
  );
}
