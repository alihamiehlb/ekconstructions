import { verifyAdminSession } from "@/lib/auth";
import { readCms, writeCms } from "@/lib/cms";
import { projectSchema } from "@/lib/cms/schema";
import { logSecurityEvent } from "@/lib/security/audit";
import { guardMutation, getClientIp } from "@/lib/security/api-guard";
import { sanitizeCmsPayload } from "@/lib/security/sanitize-cms";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  projects: z.array(projectSchema),
});

export async function GET() {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cms = await readCms();
  const hiddenExampleCount = cms.projects.filter((p) =>
    p.src.startsWith("/images/gallery/"),
  ).length;

  return NextResponse.json({
    projects: cms.projects.filter((p) => !p.src.startsWith("/images/gallery/")),
    hiddenExampleCount,
  });
}

export async function PUT(request: Request) {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const blocked = await guardMutation(request, {
    csrf: true,
    origin: true,
    rateLimit: { key: "admin-cms-projects", max: 30, windowMs: 15 * 60 * 1000 },
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
      { error: "Invalid project data", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const cms = await readCms();
    const merged = sanitizeCmsPayload({
      ...cms,
      projects: parsed.data.projects,
    });

    await writeCms({ ...merged, updatedAt: new Date().toISOString() });

    await logSecurityEvent({
      type: "cms_update",
      ip: getClientIp(request),
      detail: `Projects updated (${merged.projects.length} items)`,
    });

    return NextResponse.json({ ok: true, count: merged.projects.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
