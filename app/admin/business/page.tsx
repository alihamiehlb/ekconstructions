import { AdminBusinessHub } from "@/components/admin/AdminBusinessHub";
import { AdminNav } from "@/components/admin/AdminNav";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getBusinessStats, listInvoices, listOrders } from "@/lib/business";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Business" };

export default async function AdminBusinessPage() {
  await requireAdmin();
  const [stats, orders, invoices] = await Promise.all([
    getBusinessStats(),
    listOrders(),
    listInvoices(),
  ]);

  return (
    <div className="section-pad py-6 sm:py-10">
      <AdminPageHeader
        title="Business"
        description="Orders, invoices, revenue, costs, margin, and outstanding payments."
      />
      <AdminNav />
      <div className="mt-8">
        <AdminBusinessHub stats={stats} orders={orders} invoices={invoices} />
      </div>
    </div>
  );
}
