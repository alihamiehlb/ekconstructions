import { AdminLogoutButton } from "@/components/admin/AdminLogoutButton";
import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  badge?: string;
};

export function AdminPageHeader({ title, description, badge }: Props) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-[0.3em] text-ek-teal uppercase">Admin</p>
        <div className="mt-1 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-black text-ek-navy uppercase sm:text-3xl">{title}</h1>
          {badge && (
            <span className="rounded-full bg-ek-teal/12 px-3 py-1 text-[10px] font-bold tracking-wider text-ek-teal uppercase">
              {badge}
            </span>
          )}
        </div>
        {description && <p className="mt-2 max-w-2xl text-sm text-ek-muted">{description}</p>}
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/"
          target="_blank"
          className="text-xs font-semibold tracking-wide text-ek-teal uppercase hover:underline"
        >
          View site
        </Link>
        <AdminLogoutButton />
      </div>
    </div>
  );
}
