export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ek-gray">
      <div className="border-b border-ek-navy/8 bg-white/90 backdrop-blur">
        <div className="section-pad flex flex-wrap items-center justify-between gap-2 py-3">
          <p className="text-xs font-semibold tracking-[0.25em] text-ek-navy uppercase">
            EK Admin
          </p>
          <p className="hidden text-[10px] font-medium tracking-wide text-ek-muted uppercase sm:block">
            Secure area · CSRF protected
          </p>
        </div>
      </div>
      {children}
    </div>
  );
}
