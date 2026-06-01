import { verifyAdminSession } from "@/lib/auth";
import { readCms, writeCms } from "@/lib/cms";
import { mergeCmsWithDefaults } from "@/lib/cms/merge";
import { projectSchema, cmsSchema } from "@/lib/cms/schema";
import { isAcceptableGalleryImageInput, isValidGalleryImageSrc } from "@/lib/gallery-image";
import { resolveAllProjectMedia } from "@/lib/instagram/resolve-project";
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

    const invalidInput = sanitizedProjects.filter(
      (p) => !p.title?.trim() || !p.src?.trim() || !isAcceptableGalleryImageInput(p.src),
    );
    if (invalidInput.length > 0) {
      return NextResponse.json(
        {
          error:
            "Each project needs a title and a cover image (upload, image URL, or Instagram post link).",
        },
        { status: 400 },
      );
    }

    let resolvedProjects = sanitizedProjects;
    let instagramResolved = 0;
    try {
      const resolved = await resolveAllProjectMedia(sanitizedProjects);
      resolvedProjects = resolved.projects;
      instagramResolved = resolved.instagramResolved;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not fetch image from Instagram.";
      return NextResponse.json({ error: message }, { status: 400 });
    }

    const invalidAfterResolve = resolvedProjects.filter((p) => !isValidGalleryImageSrc(p.src));
    if (invalidAfterResolve.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cover image could not be resolved. Check Instagram links are public, or upload the image instead.",
        },
        { status: 400 },
      );
    }

    const merged = mergeCmsWithDefaults({
      ...cms,
      projects: resolvedProjects,
    });

    const validated = cmsSchema.safeParse(merged);
    if (!validated.success) {
      return NextResponse.json(
        { error: "CMS validation failed after merge", details: validated.error.flatten() },
        { status: 400 },
      );
    }

    await writeCms(merged);

    await logSecurityEvent({
      type: instagramResolved > 0 ? "instagram_sync" : "cms_update",
      ip: getClientIp(request),
      detail: `Projects updated (${merged.projects.length} items${
        instagramResolved > 0 ? `, ${instagramResolved} from Instagram` : ""
      })`,
    });

    return NextResponse.json({
      ok: true,
      count: merged.projects.length,
      projects: merged.projects,
      instagramResolved,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    console.error("PUT /api/admin/cms/projects:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
