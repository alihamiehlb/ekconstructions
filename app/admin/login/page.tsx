import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { verifyAdminSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata = { title: "Admin Login" };

export default async function AdminLoginPage() {
  if (await verifyAdminSession()) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-ek-gray px-5">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <p className="text-xs font-semibold tracking-[0.3em] text-ek-teal uppercase">EK Admin</p>
        <h1 className="mt-2 text-2xl font-black text-ek-navy uppercase">Sign in</h1>
        <p className="mt-2 text-sm text-ek-muted">
          Dashboard for leads, page views, and conversion stats.
        </p>
        <div className="mt-8">
          <AdminLoginForm />
        </div>
      </div>
    </div>
  );
}
