"use client";

import { usePathname } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) return <>{children}</>;

  return (
    <>
      <div className="section-pad border-b border-ek-navy/8 bg-white/80 pb-4 pt-5 backdrop-blur-sm">
        <AdminNav />
      </div>
      {children}
    </>
  );
}
