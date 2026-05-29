import { promises as fs } from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

export type AuditEvent = {
  at: string;
  type:
    | "login_success"
    | "login_failed"
    | "login_rate_limited"
    | "csrf_failed"
    | "origin_blocked"
    | "cms_update"
    | "cms_upload"
    | "contact_spam"
    | "instagram_sync"
    | "instagram_discover"
    | "app_info"
    | "app_warn"
    | "app_error";
  ip?: string;
  detail?: string;
};

const LOG_PATH = path.join(process.cwd(), "data", "security-audit.json");
const MAX_EVENTS = 200;

function supabaseAuditClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function logSecurityEvent(event: Omit<AuditEvent, "at">): Promise<void> {
  const row = { ...event, at: new Date().toISOString() };

  const client = supabaseAuditClient();
  if (client) {
    try {
      await client.from("security_audit").insert({
        type: event.type,
        ip: event.ip ?? null,
        detail: event.detail?.slice(0, 500) ?? null,
      });
    } catch (e) {
      console.error("supabase audit error:", e);
    }
  }

  try {
    await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
    let events: AuditEvent[] = [];
    try {
      const raw = await fs.readFile(LOG_PATH, "utf-8");
      events = JSON.parse(raw) as AuditEvent[];
    } catch {
      events = [];
    }
    events.unshift(row);
    await fs.writeFile(LOG_PATH, JSON.stringify(events.slice(0, MAX_EVENTS), null, 2), "utf-8");
  } catch (e) {
    console.error("audit log file error:", e);
  }
}

export async function readSecurityAudit(limit = 50): Promise<AuditEvent[]> {
  const client = supabaseAuditClient();
  if (client) {
    try {
      const { data, error } = await client
        .from("security_audit")
        .select("created_at, type, ip, detail")
        .order("created_at", { ascending: false })
        .limit(limit);
      if (!error && data?.length) {
        return data.map((r) => ({
          at: r.created_at as string,
          type: r.type as AuditEvent["type"],
          ip: r.ip ?? undefined,
          detail: r.detail ?? undefined,
        }));
      }
    } catch {
      /* fall through */
    }
  }

  try {
    const raw = await fs.readFile(LOG_PATH, "utf-8");
    const events = JSON.parse(raw) as AuditEvent[];
    return events.slice(0, limit);
  } catch {
    return [];
  }
}
