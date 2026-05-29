import { siteConfig } from "@/content/site";

function addUrlOrigin(origins: Set<string>, value: string | undefined) {
  if (!value?.trim()) return;
  try {
    const url = value.includes("://") ? value : `https://${value}`;
    origins.add(new URL(url).origin);
  } catch {
    /* ignore invalid */
  }
}

function allowedOrigins(request?: Request): string[] {
  const origins = new Set<string>([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://localhost:3000",
  ]);

  addUrlOrigin(origins, process.env.NEXT_PUBLIC_SITE_URL);
  addUrlOrigin(origins, process.env.VERCEL_URL);
  addUrlOrigin(origins, process.env.VERCEL_BRANCH_URL);
  addUrlOrigin(origins, process.env.VERCEL_PROJECT_PRODUCTION_URL);

  try {
    origins.add(new URL(siteConfig.url).origin);
  } catch {
    /* ignore */
  }

  if (request) {
    const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
    if (host) {
      const hostname = host.split(",")[0]?.trim();
      if (hostname) {
        origins.add(`https://${hostname}`);
        origins.add(`http://${hostname}`);
      }
    }
  }

  return [...origins];
}

export function isAllowedOrigin(request: Request): boolean {
  const allowed = allowedOrigins(request);
  const origin = request.headers.get("origin");

  if (origin) {
    if (allowed.includes(origin)) return true;
    try {
      const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
      if (host && origin === `https://${host.split(",")[0]?.trim()}`) return true;
    } catch {
      /* ignore */
    }
    return false;
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return allowed.includes(new URL(referer).origin);
    } catch {
      return false;
    }
  }

  return process.env.NODE_ENV !== "production";
}
