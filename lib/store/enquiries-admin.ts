import type { Enquiry, EnquiryStatus } from "@/lib/store/types";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/store/supabase-store";

function getClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

function mapRow(row: Record<string, unknown>): Enquiry {
  return {
    id: row.id as string,
    createdAt: row.created_at as string,
    name: row.name as string,
    email: row.email as string,
    phone: (row.phone as string | null) ?? undefined,
    service: (row.service as string | null) ?? undefined,
    message: row.message as string,
    sourceIp: (row.source_ip as string | null) ?? undefined,
    status: (row.status as EnquiryStatus | null) ?? "new",
    notes: (row.notes as string | null) ?? undefined,
    readAt: (row.read_at as string | null) ?? undefined,
  };
}

export async function listEnquiries(limit = 100): Promise<Enquiry[]> {
  if (isSupabaseConfigured()) {
    const client = getClient();
    if (!client) return [];
    const { data, error } = await client
      .from("enquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map(mapRow);
  }

  const { fileListEnquiries } = await import("@/lib/store/file-enquiries");
  return fileListEnquiries(limit);
}

export async function updateEnquiry(
  id: string,
  patch: Partial<{ status: EnquiryStatus; notes: string; readAt: string | null }>,
): Promise<Enquiry> {
  if (isSupabaseConfigured()) {
    const client = getClient();
    if (!client) throw new Error("Supabase not configured");

    const row: Record<string, unknown> = {};
    if (patch.status !== undefined) row.status = patch.status;
    if (patch.notes !== undefined) row.notes = patch.notes;
    if (patch.readAt !== undefined) row.read_at = patch.readAt;

    const { data, error } = await client
      .from("enquiries")
      .update(row)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return mapRow(data);
  }

  const { fileUpdateEnquiry } = await import("@/lib/store/file-enquiries");
  return fileUpdateEnquiry(id, patch);
}

export async function deleteEnquiry(id: string): Promise<void> {
  if (isSupabaseConfigured()) {
    const client = getClient();
    if (!client) throw new Error("Supabase not configured");
    const { error } = await client.from("enquiries").delete().eq("id", id);
    if (error) throw error;
    return;
  }

  const { fileDeleteEnquiry } = await import("@/lib/store/file-enquiries");
  await fileDeleteEnquiry(id);
}
