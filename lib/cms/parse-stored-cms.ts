import { mergeCmsWithDefaults } from "@/lib/cms/merge";
import { cmsSchema, projectSchema } from "@/lib/cms/schema";
import type { CmsData } from "@/lib/cms/types";
import { z } from "zod";

/** Parse CMS JSON from storage; salvages projects when the full document fails validation. */
export function parseStoredCms(data: unknown, updatedAt?: string | null): CmsData {
  const parsed = cmsSchema.safeParse(data);
  if (parsed.success) {
    return mergeCmsWithDefaults({
      ...parsed.data,
      updatedAt: updatedAt ?? undefined,
    });
  }

  console.error("parseStoredCms: full schema failed", parsed.error.flatten());

  const raw =
    typeof data === "object" && data !== null ? (data as Record<string, unknown>) : {};
  const partial: Partial<CmsData> = {
    updatedAt: typeof updatedAt === "string" ? updatedAt : undefined,
  };

  const site = cmsSchema.shape.site.safeParse(raw.site);
  if (site.success) partial.site = site.data;

  const services = z.array(cmsSchema.shape.services.element).safeParse(raw.services);
  if (services.success) partial.services = services.data;

  const why = z.array(cmsSchema.shape.whyChooseUs.element).safeParse(raw.whyChooseUs);
  if (why.success) partial.whyChooseUs = why.data;

  const materials = z.array(z.string().min(1)).safeParse(raw.materials);
  if (materials.success) partial.materials = materials.data;

  if (Array.isArray(raw.projects)) {
    partial.projects = raw.projects
      .map((item) => projectSchema.safeParse(item))
      .filter((r): r is z.SafeParseSuccess<z.infer<typeof projectSchema>> => r.success)
      .map((r) => r.data);
  }

  return mergeCmsWithDefaults(partial);
}
