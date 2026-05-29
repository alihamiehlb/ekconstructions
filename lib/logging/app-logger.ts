import { logSecurityEvent, type AuditEvent } from "@/lib/security/audit";

export type LogLevel = "info" | "warn" | "error";

export type AppLogContext = Record<string, string | number | boolean | null | undefined>;

type AppLogInput = {
  level: LogLevel;
  source: string;
  message: string;
  context?: AppLogContext;
  ip?: string;
};

const LEVEL_TO_AUDIT: Record<LogLevel, AuditEvent["type"]> = {
  info: "app_info",
  warn: "app_warn",
  error: "app_error",
};

/** Structured logs for Vercel Runtime Logs + durable admin audit trail. */
export async function logAppEvent(input: AppLogInput): Promise<void> {
  const payload = {
    ts: new Date().toISOString(),
    level: input.level,
    source: input.source,
    message: input.message,
    ...(input.context ? { context: input.context } : {}),
  };

  console.log(JSON.stringify(payload));

  const detail = JSON.stringify({
    source: input.source,
    message: input.message,
    ...(input.context ? { context: input.context } : {}),
  }).slice(0, 500);

  await logSecurityEvent({
    type: LEVEL_TO_AUDIT[input.level],
    ip: input.ip,
    detail,
  });
}

export function logAppEventSync(input: Omit<AppLogInput, "ip">): void {
  void logAppEvent(input);
}
