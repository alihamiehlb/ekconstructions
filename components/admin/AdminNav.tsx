"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/inquiries", label: "Enquiries" },
  { href: "/admin/business", label: "Business" },
  { href: "/admin/content", label: "Site content" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/instagram", label: "Instagram" },
  { href: "/admin/accounts", label: "Accounts" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/logs", label: "Logs" },
  { href: "/admin/security", label: "Security" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex flex-wrap gap-2" aria-label="Admin sections">
      {links.map((link) => {
        const active = pathname === link.href || (link.href !== "/admin" && pathname.startsWith(`${link.href}/`));
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`admin-nav-link rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase transition ${
              active
                ? "bg-ek-navy text-white shadow-sm"
                : "bg-white text-ek-muted ring-1 ring-ek-navy/10 hover:-translate-y-0.5 hover:text-ek-navy hover:shadow-sm"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
