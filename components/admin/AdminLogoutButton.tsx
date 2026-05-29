"use client";

import { clearCsrfCache, secureJsonFetch } from "@/lib/security/client-fetch";
import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  async function logout() {
    await secureJsonFetch("/api/admin/logout", { method: "POST", body: "{}" });
    clearCsrfCache();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      className="rounded-full border border-ek-navy/15 px-4 py-2 text-xs font-semibold tracking-wide text-ek-navy uppercase transition hover:border-ek-teal hover:text-ek-teal focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ek-teal"
    >
      Log out
    </button>
  );
}
