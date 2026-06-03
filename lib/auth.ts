import { findAdminUserByEmail, touchAdminLogin } from "@/lib/admin/users";
import { verifyPassword } from "@/lib/admin/password";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "ek_admin_session";

export type AdminSessionUser = {
  id?: string;
  email?: string;
  name?: string;
  role: "admin" | "editor" | "viewer";
};

function getSecret(): Uint8Array | null {
  const secret = process.env.ADMIN_SECRET;
  if (!secret || secret.length < 32) return null;
  return new TextEncoder().encode(secret);
}

export function isAdminSecretConfigured(): boolean {
  return getSecret() !== null;
}

export async function createAdminSession(user: AdminSessionUser = { role: "admin" }) {
  const secret = getSecret();
  if (!secret) {
    throw new Error("ADMIN_SECRET must be set (min 32 characters) on the server.");
  }
  const token = await new SignJWT({
    role: user.role,
    sub: user.id,
    email: user.email,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret);

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}

export async function getAdminSession(): Promise<AdminSessionUser | null> {
  const secret = getSecret();
  if (!secret) return null;

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      id: payload.sub as string | undefined,
      email: payload.email as string | undefined,
      name: payload.name as string | undefined,
      role: (payload.role as AdminSessionUser["role"]) ?? "admin",
    };
  } catch {
    return null;
  }
}

export async function verifyAdminSession(): Promise<boolean> {
  return (await getAdminSession()) !== null;
}

export async function requireAdmin() {
  const ok = await verifyAdminSession();
  if (!ok) redirect("/admin/login");
}

export async function requireAdminRole(roles: AdminSessionUser["role"][]) {
  const session = await getAdminSession();
  if (!session || !roles.includes(session.role)) {
    redirect("/admin");
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;

  const a = Buffer.from(password);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function verifyAdminCredentials(
  email: string | undefined,
  password: string,
): Promise<AdminSessionUser | null> {
  if (email?.trim()) {
    const user = await findAdminUserByEmail(email);
    if (user && (await verifyPassword(password, user.password_hash as string))) {
      await touchAdminLogin(user.id as string);
      return {
        id: user.id as string,
        email: user.email as string,
        name: user.name as string,
        role: user.role as AdminSessionUser["role"],
      };
    }
  }

  if (verifyAdminPassword(password)) {
    return { role: "admin", email: email?.trim() || undefined, name: "Legacy admin" };
  }

  return null;
}
