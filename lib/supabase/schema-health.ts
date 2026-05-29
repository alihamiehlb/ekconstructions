import { createClient } from "@supabase/supabase-js";
import { isMissingSchemaError } from "@/lib/supabase/errors";
import { isSupabaseConfigured } from "@/lib/store/supabase-store";

export type SchemaHealth = {
  supabaseConfigured: boolean;
  enquiryCrm: boolean;
  adminUsers: boolean;
  business: boolean;
  migrationRequired: boolean;
};

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

async function tableExists(table: string): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  const { error } = await client.from(table).select("*", { head: true, count: "exact" });
  if (error && isMissingSchemaError(error)) return false;
  return !error;
}

async function enquiryCrmReady(): Promise<boolean> {
  const client = getClient();
  if (!client) return false;
  const { error } = await client.from("enquiries").select("status", { head: true });
  if (error && isMissingSchemaError(error)) return false;
  return !error;
}

export async function getSchemaHealth(): Promise<SchemaHealth> {
  if (!isSupabaseConfigured()) {
    return {
      supabaseConfigured: false,
      enquiryCrm: true,
      adminUsers: false,
      business: false,
      migrationRequired: false,
    };
  }

  const [enquiryCrm, adminUsers, business] = await Promise.all([
    enquiryCrmReady(),
    tableExists("admin_users"),
    tableExists("business_orders"),
  ]);

  return {
    supabaseConfigured: true,
    enquiryCrm,
    adminUsers,
    business,
    migrationRequired: !enquiryCrm || !adminUsers || !business,
  };
}

export const MIGRATION_FILE = "supabase/migrations/20240529180000_admin_business_enquiries.sql";
