import { AdminInquiriesManager } from "@/components/admin/AdminInquiriesManager";
import { AdminMigrationBanner } from "@/components/admin/AdminMigrationBanner";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { readCms } from "@/lib/cms";
import { requireAdmin } from "@/lib/auth";
import { listEnquiries } from "@/lib/store/enquiries-admin";
import { getSchemaHealth } from "@/lib/supabase/schema-health";
import type { Enquiry } from "@/lib/store/types";

export const metadata = { title: "Enquiries" };

export default async function AdminInquiriesPage() {
  await requireAdmin();
  const schema = await getSchemaHealth();

  let enquiries: Enquiry[] = [];
  let contactEmail = "hello@ekconstructions.com.au";
  let loadError: string | undefined;

  try {
    const [list, cms] = await Promise.all([listEnquiries(200), readCms()]);
    enquiries = list;
    contactEmail = cms.site.contactEmail;
  } catch (error) {
    loadError = error instanceof Error ? error.message : "Could not load enquiries.";
    console.error("AdminInquiriesPage:", error);
  }

  return (
    <div className="section-pad py-6 sm:py-10">
      <AdminPageHeader
        title="Enquiries"
        description="Manage contact form leads, reply via Gmail, track status, and create quotes."
      />
      <AdminNav />
      <div className="mt-8 space-y-6">
        {loadError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            {loadError}
          </div>
        )}
        {!schema.enquiryCrm && schema.supabaseConfigured && (
          <AdminMigrationBanner missing={["enquiryCrm"]} />
        )}
        <AdminInquiriesManager
          initialEnquiries={enquiries}
          contactEmail={contactEmail}
          crmReady={schema.enquiryCrm}
        />
      </div>
    </div>
  );
}
