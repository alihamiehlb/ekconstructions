import { AdminProjectsEditor } from "@/components/admin/AdminProjectsEditor";
import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import { requireAdmin } from "@/lib/auth";
import { getAdminProjects } from "@/lib/projects";
import { isMissingSchemaError, schemaErrorMessage } from "@/lib/supabase/errors";
import Link from "next/link";

export const metadata = { title: "Gallery" };

export default async function AdminProjectsPage() {
  await requireAdmin();

  let initialProjects: Awaited<ReturnType<typeof getAdminProjects>> = [];
  let loadError: string | null = null;

  try {
    initialProjects = await getAdminProjects();
  } catch (error) {
    console.error("admin projects load:", error);
    loadError = isMissingSchemaError(error)
      ? "Database tables are missing. Run the Supabase migration from Settings, then refresh."
      : schemaErrorMessage(error);
  }

  return (
    <div className="section-pad py-6 sm:py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-semibold tracking-[0.3em] text-ek-teal uppercase">Admin</p>
          <h1 className="text-2xl font-black text-ek-navy uppercase sm:text-3xl">Gallery</h1>
          <p className="mt-1 max-w-xl text-sm text-ek-muted">
            Manage every project on the public site — images, categories, order, and featured picks
            for the homepage.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/gallery"
            target="_blank"
            className="text-xs font-semibold tracking-wide text-ek-teal uppercase hover:underline"
          >
            View live gallery
          </Link>
          <AdminLogoutButton />
        </div>
      </div>
      <div className="mt-8">
        <AdminProjectsEditor initialProjects={initialProjects} loadError={loadError} />
      </div>
    </div>
  );
}
