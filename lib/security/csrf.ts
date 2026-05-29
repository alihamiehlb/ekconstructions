import { createHash, randomBytes, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const CSRF_COOKIE = "ek_csrf";
export const CSRF_HEADER = "x-csrf-token";

export function generateCsrfToken(): string {
  return randomBytes(32).toString("hex");
}

export async function setCsrfCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 4,
  });
}

export async function verifyCsrfToken(request: Request): Promise<boolean> {
  const header = request.headers.get(CSRF_HEADER);
  const cookieStore = await cookies();
  const cookie = cookieStore.get(CSRF_COOKIE)?.value;

  if (!header || !cookie) return false;
  if (header.length !== cookie.length) return false;

  try {
    return timingSafeEqual(Buffer.from(header), Buffer.from(cookie));
  } catch {
    return false;
  }
}

export function hashForAudit(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 16);
}
