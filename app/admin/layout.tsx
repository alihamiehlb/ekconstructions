import { AdminScrollFix } from "@/components/admin/AdminScrollFix";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-shell min-h-dvh bg-ek-gray">
      <AdminScrollFix />
      <div className="admin-topbar border-b border-ek-navy/8 bg-white/95 backdrop-blur-md">
        <div className="section-pad flex flex-wrap items-center justify-between gap-2 py-3">
          <p className="text-xs font-semibold tracking-[0.25em] text-ek-navy uppercase">
            EK Admin
          </p>
          <p className="hidden text-[10px] font-medium tracking-wide text-ek-muted uppercase sm:block">
            Secure area · CSRF protected · Native scroll
          </p>
        </div>
      </div>
      <div className="admin-content">{children}</div>
    </div>
  );
}
