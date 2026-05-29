import { guardMutation, getClientIp } from "@/lib/security/api-guard";
import { sanitizePath, sanitizeText } from "@/lib/security/sanitize";
import { savePageView } from "@/lib/store";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  path: z.string().max(500),
  referrer: z.string().max(500).optional(),
});

export async function POST(request: Request) {
  const blocked = await guardMutation(request, {
    csrf: false,
    origin: true,
    rateLimit: { key: "pageview", max: 120, windowMs: 15 * 60 * 1000 },
  });
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const safePath = sanitizePath(parsed.data.path);
  if (!safePath || safePath.startsWith("/admin")) {
    return NextResponse.json({ ok: true });
  }

  const referrer = parsed.data.referrer
    ? sanitizeText(parsed.data.referrer, 500)
    : undefined;

  try {
    await savePageView(safePath, referrer);
  } catch (e) {
    console.error("pageview save error:", e);
  }

  return NextResponse.json({ ok: true });
}
