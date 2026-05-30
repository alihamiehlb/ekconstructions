import { AdminSiteEditor } from "@/components/admin/AdminSiteEditor";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";

export const metadata = { title: "Edit Site Content" };

export default async function AdminContentPage() {
  await requireAdmin();

  return (
    <div className="section-pad py-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.3em] text-ek-teal uppercase">Admin</p>
          <h1 className="text-2xl font-black text-ek-navy uppercase sm:text-3xl">Site content</h1>
          <p className="mt-1 text-sm text-ek-muted">
            Edit headlines, about copy, services, materials and trust points.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="text-xs font-semibold tracking-wide text-ek-teal uppercase hover:underline"
          >
            View site
          </Link>
          <AdminLogoutButton />
        </div>
      </div>
      <div className="mt-8">
        <AdminSiteEditor />
      </div>
    </div>
  );
}
