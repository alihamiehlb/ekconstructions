"use client";

import { secureJsonFetch } from "@/lib/security/client-fetch";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await secureJsonFetch("/api/admin/login", {
        method: "POST",
        body: JSON.stringify({ email: email.trim() || undefined, password }),
      });

      const json = await res.json();
      setLoading(false);

      if (!res.ok) {
        const msg = json.error ?? "Login failed";
        if (res.status === 403) {
          setError(`${msg} Try again from your main site URL (not a preview link).`);
        } else if (res.status === 503) {
          setError(msg);
        } else {
          setError(msg);
        }
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setLoading(false);
      setError("Could not sign in. Refresh and try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm font-semibold text-ek-navy">
          Email <span className="font-normal text-ek-muted">(optional for legacy login)</span>
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-lg border border-ek-navy/15 px-4 py-3 outline-none focus:border-ek-teal focus:ring-2 focus:ring-ek-teal/20"
          autoComplete="username"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm font-semibold text-ek-navy">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-lg border border-ek-navy/15 px-4 py-3 outline-none focus:border-ek-teal focus:ring-2 focus:ring-ek-teal/20"
          autoComplete="current-password"
          required
        />
      </div>
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-ek-teal py-3 text-sm font-bold tracking-wide text-white uppercase hover:bg-ek-teal-dark disabled:opacity-60"
      >
        {loading ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
