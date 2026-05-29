import { siteConfig } from "@/content/site";

function allowedOrigins(): string[] {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  const origins = new Set<string>([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://localhost:3000",
  ]);

  if (fromEnv) {
    try {
      origins.add(new URL(fromEnv).origin);
    } catch {
      /* ignore invalid env */
    }
  }

  try {
    origins.add(new URL(siteConfig.url).origin);
  } catch {
    /* ignore */
  }

  return [...origins];
}

export function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) {
    const referer = request.headers.get("referer");
    if (!referer) return process.env.NODE_ENV !== "production";
    try {
      return allowedOrigins().includes(new URL(referer).origin);
    } catch {
      return false;
    }
  }
  return allowedOrigins().includes(origin);
}
