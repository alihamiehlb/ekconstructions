import { logSecurityEvent } from "@/lib/security/audit";
import { guardMutation } from "@/lib/security/api-guard";
import { saveEnquiry } from "@/lib/store";
import { contactSchema } from "@/lib/validation";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const blocked = await guardMutation(request, {
    csrf: true,
    origin: true,
    rateLimit: { key: "contact", max: 5, windowMs: 15 * 60 * 1000 },
  });
  if (blocked) return blocked;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.errors[0]?.message ?? "Invalid form data." },
      { status: 400 },
    );
  }

  const { website, ...data } = parsed.data;
  if (website) {
    await logSecurityEvent({
      type: "contact_spam",
      ip: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown",
    });
    return NextResponse.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  try {
    await saveEnquiry({
      name: data.name,
      email: data.email,
      phone: data.phone,
      service: data.service,
      message: data.message,
      sourceIp: ip,
    });
  } catch (e) {
    console.error("saveEnquiry error:", e);
    return NextResponse.json(
      { error: "Could not save your enquiry. Please try again or call us." },
      { status: 503 },
    );
  }

  if (process.env.RESEND_API_KEY && process.env.CONTACT_TO_EMAIL) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: process.env.CONTACT_FROM_EMAIL ?? "onboarding@resend.dev",
          to: process.env.CONTACT_TO_EMAIL,
          subject: `New enquiry from ${data.name}`,
          text: [
            `Name: ${data.name}`,
            `Email: ${data.email}`,
            data.phone ? `Phone: ${data.phone}` : null,
            data.service ? `Service: ${data.service}` : null,
            "",
            data.message,
          ]
            .filter(Boolean)
            .join("\n"),
        }),
      });
    } catch (e) {
      console.error("Resend error:", e);
      return NextResponse.json(
        { error: "Could not send your message. Please email us directly." },
        { status: 503 },
      );
    }
  } else {
    console.info("[contact enquiry]", JSON.stringify({ ...data, ip: "[redacted]" }));
  }

  return NextResponse.json({ ok: true });
}
