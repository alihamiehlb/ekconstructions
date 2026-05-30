import { AdminBusinessHub } from "@/components/admin/AdminBusinessHub";
import { AdminMigrationBanner } from "@/components/admin/AdminMigrationBanner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { getBusinessStats, listInvoices, listOrders } from "@/lib/business";
import { requireAdmin } from "@/lib/auth";
import { getSchemaHealth } from "@/lib/supabase/schema-health";
import type { BusinessInvoice, BusinessOrder, BusinessStats } from "@/lib/store/types";

export const metadata = { title: "Business" };

const emptyStats: BusinessStats = {
  revenueCents: 0,
  costCents: 0,
  marginCents: 0,
  marginPercent: 0,
  ordersTotal: 0,
  ordersActive: 0,
  invoicesTotal: 0,
  invoicesPaid: 0,
  invoicesOutstandingCents: 0,
  clientsTotal: 0,
};

export default async function AdminBusinessPage() {
  await requireAdmin();
  const schema = await getSchemaHealth();

  let stats = emptyStats;
  let orders: BusinessOrder[] = [];
  let invoices: BusinessInvoice[] = [];
  let loadError: string | undefined;

  try {
    [stats, orders, invoices] = await Promise.all([
      getBusinessStats(),
      listOrders(),
      listInvoices(),
    ]);
  } catch (error) {
    loadError =
      error instanceof Error ? error.message : "Could not load business data.";
    console.error("AdminBusinessPage:", error);
  }

  return (
    <div className="section-pad py-6 sm:py-10">
      <AdminPageHeader
        title="Business"
        description="Orders, invoices, revenue, costs, margin, and outstanding payments."
      />
      <div className="mt-8 space-y-6">
        {loadError && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
            {loadError}
          </div>
        )}
        {!schema.business && schema.supabaseConfigured && (
          <AdminMigrationBanner missing={["business"]} />
        )}
        <AdminBusinessHub stats={stats} orders={orders} invoices={invoices} />
      </div>
    </div>
  );
}
