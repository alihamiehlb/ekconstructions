import { verifyAdminSession } from "@/lib/auth";
import { readCms, writeCms } from "@/lib/cms";
import { mergeCmsWithDefaults } from "@/lib/cms/merge";
import { projectSchema } from "@/lib/cms/schema";
import { logSecurityEvent } from "@/lib/security/audit";
import { guardMutation, getClientIp } from "@/lib/security/api-guard";
import { sanitizeProject } from "@/lib/security/sanitize-cms";
import { NextResponse } from "next/server";
import { z } from "zod";

const bodySchema = z.object({
  projects: z.array(projectSchema),
});

export async function GET() {
  const ok = await verifyAdminSession();
  if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const cms = await readCms();
  return NextResponse.json({ projects: cms.projects });
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
    const sanitizedProjects = parsed.data.projects.map((project, index) =>
      sanitizeProject({ ...project, sortOrder: project.sortOrder ?? index + 1 }),
    );

    const merged = mergeCmsWithDefaults({
      ...cms,
      projects: sanitizedProjects,
    });

    await writeCms({ ...merged, updatedAt: new Date().toISOString() });

    await logSecurityEvent({
      type: "cms_update",
      ip: getClientIp(request),
      detail: `Projects updated (${merged.projects.length} items)`,
    });

    return NextResponse.json({ ok: true, count: merged.projects.length, projects: merged.projects });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    console.error("PUT /api/admin/cms/projects:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
