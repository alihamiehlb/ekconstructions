import { verifyAdminSession } from "@/lib/auth";
import { readCms, writeCms } from "@/lib/cms";
import { mergeCmsWithDefaults } from "@/lib/cms/merge";
import { beforeAfterItemSchema, beforeAfterSectionSchema } from "@/lib/cms/schema";
import { logSecurityEvent } from "@/lib/security/audit";
import { guardMutation, getClientIp } from "@/lib/security/api-guard";
import { sanitizeCmsPayload } from "@/lib/security/sanitize-cms";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  section: beforeAfterSectionSchema,
  items: z.array(beforeAfterItemSchema),
});

export async function GET() {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cms = await readCms();
  return NextResponse.json({
    section: cms.beforeAfterSection,
    items: cms.beforeAfterItems,
  });
}

export async function PUT(request: Request) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blocked = await guardMutation(request, {
    csrf: true,
    origin: true,
    rateLimit: { key: "admin-cms-before-after", max: 30, windowMs: 15 * 60 * 1000 },
  });
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid before/after data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const cms = await readCms();
    const merged = mergeCmsWithDefaults(
      sanitizeCmsPayload({
        ...cms,
        beforeAfterSection: parsed.data.section,
        beforeAfterItems: parsed.data.items,
      }),
    );

    await writeCms({ ...merged, updatedAt: new Date().toISOString() });

    await logSecurityEvent({
      type: "cms_update",
      ip: getClientIp(request),
      detail: `Before/after updated (${merged.beforeAfterItems.length} slides)`,
    });

    return NextResponse.json({ ok: true, count: merged.beforeAfterItems.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
