import { AdminNav } from "@/components/admin/AdminNav";
import { AdminProjectsEditor } from "@/components/admin/AdminProjectsEditor";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";

export const metadata = { title: "Edit Projects" };

export default async function AdminProjectsPage() {
  await requireAdmin();

  return (
    <div className="section-pad py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-ek-teal uppercase">Admin</p>
          <h1 className="text-3xl font-black text-ek-navy uppercase">Projects</h1>
          <p className="mt-1 text-sm text-ek-muted">
            Manage gallery images, titles, categories and project details.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/gallery"
            className="text-xs font-semibold tracking-wide text-ek-teal uppercase hover:underline"
          >
            View gallery
          </Link>
          <AdminLogoutButton />
        </div>
      </div>
      <AdminNav />
      <div className="mt-8">
        <AdminProjectsEditor />
      </div>
    </div>
  );
}
