import {
  fileGetStats,
  fileSaveEnquiry,
  fileSavePageView,
} from "@/lib/store/file-store";
import {
  isSupabaseConfigured,
  supabaseGetStats,
  supabaseSaveEnquiry,
  supabaseSavePageView,
} from "@/lib/store/supabase-store";
import type { AdminStats, Enquiry } from "@/lib/store/types";

export type { AdminStats, Enquiry };

export async function saveEnquiry(
  data: Omit<Enquiry, "id" | "createdAt">,
): Promise<Enquiry> {
  if (isSupabaseConfigured()) {
    return supabaseSaveEnquiry(data);
  }
  return fileSaveEnquiry(data);
}

export async function savePageView(path: string, referrer?: string) {
  if (isSupabaseConfigured()) {
    await supabaseSavePageView(path, referrer);
    return;
  }
  await fileSavePageView(path, referrer);
}

export async function getAdminStats(): Promise<AdminStats> {
  if (isSupabaseConfigured()) {
    return supabaseGetStats();
  }
  return fileGetStats();
}

export function getStorageMode(): "supabase" | "file" {
  return isSupabaseConfigured() ? "supabase" : "file";
}
