import { AdminAccountsManager } from "@/components/admin/AdminAccountsManager";
import { AdminMigrationBanner } from "@/components/admin/AdminMigrationBanner";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { requireAdmin } from "@/lib/auth";
import { isAdminUsersDbConfigured, listAdminUsers } from "@/lib/admin/users";
import { getSchemaHealth } from "@/lib/supabase/schema-health";
import type { AdminUser } from "@/lib/store/types";

export const metadata = { title: "Admin accounts" };

export default async function AdminAccountsPage() {
  await requireAdmin();
  const schema = await getSchemaHealth();
  const dbConfigured = isAdminUsersDbConfigured();
  let users: AdminUser[] = [];
  let loadError: string | undefined;

  if (dbConfigured && schema.adminUsers) {
    try {
      users = await listAdminUsers();
    } catch (error) {
      loadError = error instanceof Error ? error.message : "Could not load accounts.";
      console.error("AdminAccountsPage:", error);
    }
  }

  return (
    <div className="section-pad py-6 sm:py-10">
      <AdminPageHeader
        title="Accounts"
        description="Create additional admin logins with email and password. Requires Supabase migration."
      />
      <AdminNav />
      <div className="mt-8 space-y-6">
        {loadError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            {loadError}
          </div>
        )}
        {dbConfigured && !schema.adminUsers && (
          <AdminMigrationBanner missing={["adminUsers"]} />
        )}
        <AdminAccountsManager
          initialUsers={users}
          dbConfigured={dbConfigured && schema.adminUsers}
        />
      </div>
    </div>
  );
}
