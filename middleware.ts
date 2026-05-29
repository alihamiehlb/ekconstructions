import { jwtVerify } from "jose";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE = "ek_admin_session";
const SUSPICIOUS = /(\.\.|%2e%2e|<script|union\s+select|javascript:|onerror=|onload=)/i;

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (SUSPICIOUS.test(`${pathname}${search}`)) {
    return new NextResponse("Bad Request", { status: 400 });
  }

  const isAdminLogin = pathname === "/admin/login" || pathname === "/api/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin/") && !isAdminLogin;
  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";

  let response: NextResponse;
  if (isAdminApi) {
    response = await protectAdmin(request, true);
  } else if (isAdminPage) {
    response = await protectAdmin(request, false);
  } else {
    response = NextResponse.next();
  }

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin/")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
  }

  if (pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "no-store");
  }

  return response;
}

async function protectAdmin(request: NextRequest, api: boolean) {
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  const secret = process.env.ADMIN_SECRET;

  if (!token || !secret || secret.length < 32) {
    if (api) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(secret));
    return NextResponse.next();
  } catch {
    if (api) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};
