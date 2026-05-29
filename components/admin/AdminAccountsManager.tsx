"use client";

import type { AdminUser } from "@/lib/store/types";
import { secureJsonFetch } from "@/lib/security/client-fetch";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  initialUsers: AdminUser[];
  dbConfigured: boolean;
};

export function AdminAccountsManager({ initialUsers, dbConfigured }: Props) {
  const router = useRouter();
  const [users, setUsers] = useState(initialUsers);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor" as AdminUser["role"],
  });

  async function createAccount(e: React.FormEvent) {
    e.preventDefault();
    setMessage("");
    const res = await secureJsonFetch("/api/admin/accounts", {
      method: "POST",
      body: JSON.stringify(form),
    });
    const json = await res.json();
    if (!res.ok) {
      setMessage(json.error ?? "Could not create account");
      return;
    }
    setUsers((prev) => [...prev, json.user]);
    setForm({ name: "", email: "", password: "", role: "editor" });
    setMessage(`Account created for ${json.user.email}`);
    router.refresh();
  }

  async function toggleActive(user: AdminUser) {
    const res = await secureJsonFetch("/api/admin/accounts", {
      method: "PATCH",
      body: JSON.stringify({ id: user.id, active: !user.active }),
    });
    const json = await res.json();
    if (res.ok) {
      setUsers((prev) => prev.map((u) => (u.id === user.id ? json.user : u)));
    }
  }

  if (!dbConfigured) {
    return (
      <div className="admin-card rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-950">
        <p className="font-bold">Supabase migration required</p>
        <p className="mt-2 leading-relaxed">
          Run the SQL migration{" "}
          <code className="rounded bg-white px-1">20240529180000_admin_business_enquiries.sql</code>{" "}
          in your Supabase SQL editor, then redeploy. Until then, sign in with the legacy{" "}
          <code className="rounded bg-white px-1">ADMIN_PASSWORD</code> only.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={createAccount}
        className="admin-card grid gap-4 rounded-2xl border border-ek-navy/10 bg-white p-6 md:grid-cols-2"
      >
        <h2 className="md:col-span-2 text-sm font-bold tracking-wide text-ek-navy uppercase">
          Create admin account
        </h2>
        {(
          [
            ["name", "Full name"],
            ["email", "Email"],
            ["password", "Password (min 8 chars)"],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="block text-sm">
            <span className="font-medium text-ek-navy">{label}</span>
            <input
              type={key === "password" ? "password" : key === "email" ? "email" : "text"}
              required
              minLength={key === "password" ? 8 : 1}
              className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2"
              value={form[key]}
              onChange={(ev) => setForm({ ...form, [key]: ev.target.value })}
            />
          </label>
        ))}
        <label className="block text-sm">
          <span className="font-medium text-ek-navy">Role</span>
          <select
            className="mt-1 w-full rounded-lg border border-ek-navy/15 px-3 py-2"
            value={form.role}
            onChange={(ev) =>
              setForm({ ...form, role: ev.target.value as AdminUser["role"] })
            }
          >
            <option value="admin">Admin — full access</option>
            <option value="editor">Editor — content & enquiries</option>
            <option value="viewer">Viewer — read only</option>
          </select>
        </label>
        <div className="flex items-end">
          <button type="submit" className="btn-primary">
            Add account
          </button>
        </div>
        {message && <p className="md:col-span-2 text-sm text-ek-teal">{message}</p>}
      </form>

      <div className="admin-card overflow-hidden rounded-2xl border border-ek-navy/10 bg-white">
        <div className="border-b border-ek-navy/8 px-6 py-4">
          <h2 className="text-sm font-bold tracking-wide text-ek-navy uppercase">
            Admin accounts ({users.length})
          </h2>
        </div>
        <ul className="divide-y divide-ek-navy/8">
          {users.map((user) => (
            <li
              key={user.id}
              className="flex flex-wrap items-center justify-between gap-3 px-6 py-4"
            >
              <div>
                <p className="font-semibold text-ek-navy">{user.name}</p>
                <p className="text-sm text-ek-muted">
                  {user.email} · {user.role}
                  {user.lastLogin
                    ? ` · last login ${new Date(user.lastLogin).toLocaleDateString("en-AU")}`
                    : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleActive(user)}
                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                  user.active
                    ? "bg-ek-teal/10 text-ek-teal"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {user.active ? "Active" : "Disabled"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
