import { generateCsrfToken, setCsrfCookie } from "@/lib/security/csrf";
import { NextResponse } from "next/server";

export async function GET() {
  const token = generateCsrfToken();
  await setCsrfCookie(token);
  return NextResponse.json(
    { token },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
