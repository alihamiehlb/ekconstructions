"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/content", label: "Site content" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/security", label: "Security" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mt-6 flex flex-wrap gap-2" aria-label="Admin sections">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 text-xs font-semibold tracking-wide uppercase transition ${
              active
                ? "bg-ek-navy text-white"
                : "bg-white text-ek-muted ring-1 ring-ek-navy/10 hover:text-ek-navy"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
