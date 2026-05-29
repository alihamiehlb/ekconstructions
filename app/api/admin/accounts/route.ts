import { getAdminSession, verifyAdminSession } from "@/lib/auth";
import { hashPassword } from "@/lib/admin/password";
import {
  createAdminUser,
  isAdminUsersDbConfigured,
  listAdminUsers,
  updateAdminUser,
} from "@/lib/admin/users";
import { logSecurityEvent } from "@/lib/security/audit";
import { guardMutation, getClientIp } from "@/lib/security/api-guard";
import { sanitizeEmail, sanitizeText } from "@/lib/security/sanitize";
import { NextResponse } from "next/server";
import { z } from "zod";

const createSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120),
  password: z.string().min(8).max(128),
  role: z.enum(["admin", "editor", "viewer"]).default("editor"),
});

const patchSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(120).optional(),
  role: z.enum(["admin", "editor", "viewer"]).optional(),
  active: z.boolean().optional(),
  password: z.string().min(8).max(128).optional(),
});

export async function GET() {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!isAdminUsersDbConfigured()) {
    return NextResponse.json({
      users: [],
      dbConfigured: false,
      message: "Connect Supabase and run migrations to enable multiple admin accounts.",
    });
  }

  try {
    const users = await listAdminUsers();
    return NextResponse.json({ users, dbConfigured: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load accounts";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin role required" }, { status: 403 });
  }
  if (!isAdminUsersDbConfigured()) {
    return NextResponse.json(
      { error: "Supabase required. Run the latest migration in Supabase SQL editor." },
      { status: 503 },
    );
  }

  const blocked = await guardMutation(request, {
    csrf: true,
    origin: true,
    rateLimit: { key: "admin-accounts", max: 20, windowMs: 60 * 60 * 1000 },
  });
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid account data", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const passwordHash = await hashPassword(parsed.data.password);
    const user = await createAdminUser({
      email: sanitizeEmail(parsed.data.email),
      name: sanitizeText(parsed.data.name, 120),
      passwordHash,
      role: parsed.data.role,
    });

    const session = await getAdminSession();
    await logSecurityEvent({
      type: "cms_update",
      ip: getClientIp(request),
      detail: `Admin account created ${user.email} by ${session?.email ?? "legacy"}`,
    });

    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Create failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Admin role required" }, { status: 403 });
  }

  const blocked = await guardMutation(request, {
    csrf: true,
    origin: true,
    rateLimit: { key: "admin-accounts", max: 30, windowMs: 15 * 60 * 1000 },
  });
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    const patch: Parameters<typeof updateAdminUser>[1] = {};
    if (parsed.data.name) patch.name = sanitizeText(parsed.data.name, 120);
    if (parsed.data.role) patch.role = parsed.data.role;
    if (parsed.data.active !== undefined) patch.active = parsed.data.active;
    if (parsed.data.password) patch.passwordHash = await hashPassword(parsed.data.password);

    const user = await updateAdminUser(parsed.data.id, patch);
    return NextResponse.json({ user });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
