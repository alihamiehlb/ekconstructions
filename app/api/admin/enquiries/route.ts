import { verifyAdminSession } from "@/lib/auth";
import { deleteEnquiry, listEnquiries, updateEnquiry } from "@/lib/store/enquiries-admin";
import { logSecurityEvent } from "@/lib/security/audit";
import { guardMutation, getClientIp } from "@/lib/security/api-guard";
import { NextResponse } from "next/server";
import { z } from "zod";

const patchSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["new", "contacted", "quoted", "won", "lost"]).optional(),
  notes: z.string().max(8000).optional(),
  markRead: z.boolean().optional(),
});

export async function GET() {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const enquiries = await listEnquiries(200);
    return NextResponse.json({ enquiries });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load enquiries";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blocked = await guardMutation(request, {
    csrf: true,
    origin: true,
    rateLimit: { key: "admin-enquiries", max: 60, windowMs: 15 * 60 * 1000 },
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
    return NextResponse.json({ error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const patch: Parameters<typeof updateEnquiry>[1] = {};
    if (parsed.data.status) patch.status = parsed.data.status;
    if (parsed.data.notes !== undefined) patch.notes = parsed.data.notes;
    if (parsed.data.markRead) patch.readAt = new Date().toISOString();

    const enquiry = await updateEnquiry(parsed.data.id, patch);

    await logSecurityEvent({
      type: "cms_update",
      ip: getClientIp(request),
      detail: `Enquiry updated ${parsed.data.id} status=${parsed.data.status ?? "unchanged"}`,
    });

    return NextResponse.json({ enquiry });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blocked = await guardMutation(request, {
    csrf: true,
    origin: true,
    rateLimit: { key: "admin-enquiries-del", max: 30, windowMs: 15 * 60 * 1000 },
  });
  if (blocked) return blocked;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  try {
    await deleteEnquiry(id);
    await logSecurityEvent({
      type: "cms_update",
      ip: getClientIp(request),
      detail: `Enquiry deleted ${id}`,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
