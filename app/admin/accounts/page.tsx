import { AdminAccountsManager } from "@/components/admin/AdminAccountsManager";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { requireAdmin } from "@/lib/auth";
import { isAdminUsersDbConfigured, listAdminUsers } from "@/lib/admin/users";

export const metadata = { title: "Admin accounts" };

export default async function AdminAccountsPage() {
  await requireAdmin();
  const dbConfigured = isAdminUsersDbConfigured();
  const users = dbConfigured ? await listAdminUsers() : [];

  return (
    <div className="section-pad py-6 sm:py-10">
      <AdminPageHeader
        title="Accounts"
        description="Create additional admin logins with email and password. Requires Supabase migration."
      />
      <AdminNav />
      <div className="mt-8">
        <AdminAccountsManager initialUsers={users} dbConfigured={dbConfigured} />
      </div>
    </div>
  );
}
