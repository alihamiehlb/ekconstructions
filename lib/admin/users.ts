import type { AdminUser } from "@/lib/store/types";
import { isMissingSchemaError } from "@/lib/supabase/errors";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export function isAdminUsersDbConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

function mapRow(row: Record<string, unknown>): AdminUser {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    email: row.email as string,
    name: row.name as string,
    role: row.role as AdminUser["role"],
    active: row.active as boolean,
    lastLogin: (row.last_login as string | null) ?? undefined,
  };
}

export async function listAdminUsers(): Promise<AdminUser[]> {
  const client = getClient();
  if (!client) return [];

  const { data, error } = await client
    .from("admin_users")
    .select("id, created_at, email, name, role, active, last_login")
    .order("created_at", { ascending: true });

  if (error) {
    if (isMissingSchemaError(error)) return [];
    throw error;
  }
  return (data ?? []).map(mapRow);
}

export async function findAdminUserByEmail(email: string) {
  const client = getClient();
  if (!client) return null;

  const { data, error } = await client
    .from("admin_users")
    .select("*")
    .eq("email", email.toLowerCase().trim())
    .eq("active", true)
    .maybeSingle();

  if (error) {
    if (isMissingSchemaError(error)) return null;
    throw error;
  }
  return data as Record<string, unknown> | null;
}

export async function createAdminUser(input: {
  email: string;
  name: string;
  passwordHash: string;
  role: AdminUser["role"];
}): Promise<AdminUser> {
  const client = getClient();
  if (!client) throw new Error("Supabase required for admin accounts");

  const { data, error } = await client
    .from("admin_users")
    .insert({
      email: input.email.toLowerCase().trim(),
      name: input.name.trim(),
      password_hash: input.passwordHash,
      role: input.role,
    })
    .select("id, created_at, email, name, role, active, last_login")
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function updateAdminUser(
  id: string,
  patch: Partial<{
    name: string;
    role: AdminUser["role"];
    active: boolean;
    passwordHash: string;
  }>,
): Promise<AdminUser> {
  const client = getClient();
  if (!client) throw new Error("Supabase required for admin accounts");

  const row: Record<string, unknown> = {};
  if (patch.name !== undefined) row.name = patch.name.trim();
  if (patch.role !== undefined) row.role = patch.role;
  if (patch.active !== undefined) row.active = patch.active;
  if (patch.passwordHash !== undefined) row.password_hash = patch.passwordHash;

  const { data, error } = await client
    .from("admin_users")
    .update(row)
    .eq("id", id)
    .select("id, created_at, email, name, role, active, last_login")
    .single();

  if (error) throw error;
  return mapRow(data);
}

export async function touchAdminLogin(id: string) {
  const client = getClient();
  if (!client) return;
  await client.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", id);
}

export async function countAdminUsers(): Promise<number> {
  const client = getClient();
  if (!client) return 0;
  const { count, error } = await client
    .from("admin_users")
    .select("*", { count: "exact", head: true });
  if (error) throw error;
  return count ?? 0;
}
