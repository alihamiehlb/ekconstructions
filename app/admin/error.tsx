"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="section-pad flex min-h-[60vh] flex-col items-start justify-center py-16">
      <p className="text-xs font-semibold tracking-[0.3em] text-ek-teal uppercase">Admin error</p>
      <h1 className="mt-3 text-2xl font-black text-ek-navy uppercase">This admin page failed to load</h1>
      <p className="mt-3 max-w-lg text-sm text-ek-muted">
        {error.message.includes("ADMIN_SECRET")
          ? "Server is missing ADMIN_SECRET (32+ characters) in Vercel environment variables. Add it under Settings → Environment Variables, redeploy, then sign in again."
          : error.message.includes("schema cache") ||
              error.message.includes("Could not find the table")
            ? "Database tables may be missing. Run the Supabase migration from Admin → Settings, then refresh."
            : error.message || "An unexpected error occurred. Try again or return to the dashboard."}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          Retry
        </button>
        <Link href="/admin" className="btn-play border border-ek-navy/15 px-6 py-3">
          Dashboard
        </Link>
        <Link href="/admin/settings" className="text-xs font-semibold text-ek-teal uppercase hover:underline">
          Settings →
        </Link>
      </div>
    </div>
  );
}
