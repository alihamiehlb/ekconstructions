import { AdminAccountsManager } from "@/components/admin/AdminAccountsManager";
import { AdminMigrationBanner } from "@/components/admin/AdminMigrationBanner";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { requireAdmin } from "@/lib/auth";
import { isAdminUsersDbConfigured, listAdminUsers } from "@/lib/admin/users";
import { getSchemaHealth } from "@/lib/supabase/schema-health";

export const metadata = { title: "Admin accounts" };

export default async function AdminAccountsPage() {
  await requireAdmin();
  const schema = await getSchemaHealth();
  const dbConfigured = isAdminUsersDbConfigured();
  const users = dbConfigured && schema.adminUsers ? await listAdminUsers() : [];

  return (
    <div className="section-pad py-6 sm:py-10">
      <AdminPageHeader
        title="Accounts"
        description="Create additional admin logins with email and password. Requires Supabase migration."
      />
      <AdminNav />
      <div className="mt-8 space-y-6">
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
