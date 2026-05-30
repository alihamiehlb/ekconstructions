"use client";

import { motion } from "framer-motion";
import {
  ExternalLink,
  FileText,
  Images,
  Inbox,
  Instagram,
  LayoutDashboard,
  RefreshCw,
  Settings,
  Shield,
  Terminal,
  Wallet,
} from "lucide-react";
import Link from "next/link";

const actions = [
  {
    href: "/admin/inquiries",
    label: "Enquiries",
    desc: "Leads, Gmail replies, status",
    icon: Inbox,
    accent: "from-ek-orange/10 to-white border-ek-orange/20",
  },
  {
    href: "/admin/business",
    label: "Business hub",
    desc: "Orders, invoices, margin",
    icon: Wallet,
    accent: "from-ek-teal/15 to-ek-teal/5 border-ek-teal/25",
  },
  {
    href: "/admin/before-after",
    label: "Before & After",
    desc: "Homepage comparison slider",
    icon: Images,
    accent: "from-ek-teal/15 to-ek-teal/5 border-ek-teal/25",
  },
  {
    href: "/admin/instagram",
    label: "Sync Instagram",
    desc: "Discover or paste post URLs",
    icon: RefreshCw,
    accent: "from-ek-teal/15 to-ek-teal/5 border-ek-teal/25",
  },
  {
    href: "/admin/settings",
    label: "Instagram session",
    desc: "How to set session ID",
    icon: Settings,
    accent: "from-ek-navy/8 to-white border-ek-navy/10",
  },
  {
    href: "/admin/content",
    label: "Edit site copy",
    desc: "Headlines, services, about",
    icon: FileText,
    accent: "from-ek-navy/8 to-white border-ek-navy/10",
  },
  {
    href: "/admin/projects",
    label: "Gallery CMS",
    desc: "Projects & categories",
    icon: LayoutDashboard,
    accent: "from-ek-orange/10 to-white border-ek-orange/20",
  },
  {
    href: "/admin/logs",
    label: "Activity logs",
    desc: "Sync, errors, Vercel mirror",
    icon: Terminal,
    accent: "from-ek-navy/8 to-white border-ek-navy/10",
  },
  {
    href: "/admin/security",
    label: "Security audit",
    desc: "Login events & checklist",
    icon: Shield,
    accent: "from-ek-navy/8 to-white border-ek-navy/10",
  },
  {
    href: "https://www.instagram.com/ekconstructions/",
    label: "@ekconstructions",
    desc: "Open Instagram profile",
    icon: Instagram,
    accent: "from-pink-500/10 to-white border-pink-500/20",
    external: true,
  },
];

export function AdminQuickActions() {
  return (
    <section className="admin-card mt-8">
      <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">Quick actions</h2>
      <p className="mt-1 text-xs text-ek-muted">Jump to common management tasks</p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {actions.map((action, i) => {
          const Icon = action.icon;
          const inner = (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`group flex h-full items-start gap-3 rounded-xl border bg-gradient-to-br p-4 transition hover:-translate-y-0.5 hover:shadow-md ${action.accent}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm">
                <Icon className="h-4 w-4 text-ek-navy group-hover:text-ek-teal" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="flex items-center gap-1 text-sm font-bold text-ek-navy">
                  {action.label}
                  {action.external && <ExternalLink className="h-3 w-3 text-ek-muted" />}
                </span>
                <span className="mt-0.5 block text-xs text-ek-muted">{action.desc}</span>
              </span>
            </motion.div>
          );

          return (
            <li key={action.href}>
              {action.external ? (
                <a href={action.href} target="_blank" rel="noopener noreferrer">
                  {inner}
                </a>
              ) : (
                <Link href={action.href}>{inner}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
