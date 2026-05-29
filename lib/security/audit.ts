import { promises as fs } from "fs";
import path from "path";

export type AuditEvent = {
  at: string;
  type:
    | "login_success"
    | "login_failed"
    | "login_rate_limited"
    | "csrf_failed"
    | "origin_blocked"
    | "cms_update"
    | "contact_spam";
  ip?: string;
  detail?: string;
};

const LOG_PATH = path.join(process.cwd(), "data", "security-audit.json");
const MAX_EVENTS = 200;

export async function logSecurityEvent(event: Omit<AuditEvent, "at">): Promise<void> {
  try {
    await fs.mkdir(path.dirname(LOG_PATH), { recursive: true });
    let events: AuditEvent[] = [];
    try {
      const raw = await fs.readFile(LOG_PATH, "utf-8");
      events = JSON.parse(raw) as AuditEvent[];
    } catch {
      events = [];
    }
    events.unshift({ ...event, at: new Date().toISOString() });
    await fs.writeFile(LOG_PATH, JSON.stringify(events.slice(0, MAX_EVENTS), null, 2), "utf-8");
  } catch (e) {
    console.error("audit log error:", e);
  }
}

export async function readSecurityAudit(limit = 50): Promise<AuditEvent[]> {
  try {
    const raw = await fs.readFile(LOG_PATH, "utf-8");
    const events = JSON.parse(raw) as AuditEvent[];
    return events.slice(0, limit);
  } catch {
    return [];
  }
}
