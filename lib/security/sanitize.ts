const HTML_TAG = /<[^>]*>/g;
const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const DANGEROUS_PROTOCOL = /(?:javascript|data|vbscript):/gi;

export function stripHtml(value: string): string {
  return value.replace(HTML_TAG, "");
}

export function sanitizeText(value: string, maxLength?: number): string {
  let out = stripHtml(value).replace(CONTROL_CHARS, "").trim();
  out = out.replace(DANGEROUS_PROTOCOL, "");
  if (maxLength && out.length > maxLength) out = out.slice(0, maxLength);
  return out;
}

export function sanitizeEmail(value: string): string {
  return sanitizeText(value, 254).toLowerCase();
}

export function sanitizePath(value: string): string | null {
  const path = sanitizeText(value, 500);
  if (!path.startsWith("/")) return null;
  if (path.includes("..")) return null;
  if (path.includes("\\")) return null;
  if (/[<>"']/.test(path)) return null;
  return path;
}

export function sanitizeAssetPath(value: string): string | null {
  const path = sanitizeText(value, 500);
  if (!path.startsWith("/")) return null;
  if (path.includes("..")) return null;
  if (/[<>"']/.test(path)) return null;
  if (DANGEROUS_PROTOCOL.test(path)) return null;
  return path;
}

export function sanitizeContactInput<T extends Record<string, unknown>>(data: T): T {
  const out = { ...data };
  for (const [key, val] of Object.entries(out)) {
    if (typeof val === "string") {
      (out as Record<string, unknown>)[key] = sanitizeText(val);
    }
  }
  return out;
}
