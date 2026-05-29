import { instagramPermalink } from "@/lib/instagram/parse-url";

const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const IG_APP_ID = "936619743392459";

function sessionHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "User-Agent": UA,
    "X-IG-App-ID": IG_APP_ID,
    "X-Requested-With": "XMLHttpRequest",
    Accept: "application/json",
  };
  const sessionId = process.env.INSTAGRAM_SESSION_ID?.trim();
  if (sessionId) {
    headers.Cookie = `sessionid=${sessionId}; ig_did=${process.env.INSTAGRAM_IG_DID ?? ""}`;
  }
  return headers;
}

function shortcodesFromProfileJson(json: unknown): string[] {
  const data = json as {
    data?: {
      user?: {
        edge_owner_to_timeline_media?: {
          edges?: { node?: { shortcode?: string } }[];
        };
      };
    };
  };
  const edges = data.data?.user?.edge_owner_to_timeline_media?.edges ?? [];
  return edges.map((e) => e.node?.shortcode).filter((c): c is string => Boolean(c));
}

/** Discover post shortcodes from @ekconstructions (needs public profile or INSTAGRAM_SESSION_ID). */
export async function discoverProfilePostUrls(username = "ekconstructions"): Promise<{
  urls: string[];
  method: string;
  error?: string;
}> {
  const apiUrl = `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`;

  try {
    const res = await fetch(apiUrl, { headers: sessionHeaders() });
    if (res.ok) {
      const json: unknown = await res.json();
      const codes = shortcodesFromProfileJson(json);
      if (codes.length > 0) {
        return {
          urls: codes.map((c) => instagramPermalink(c)),
          method: "web_profile_info",
        };
      }
    }
  } catch {
    /* try HTML */
  }

  try {
    const res = await fetch(`https://www.instagram.com/${username}/`, {
      headers: { ...sessionHeaders(), Accept: "text/html" },
    });
    if (!res.ok) {
      return {
        urls: [],
        method: "none",
        error: `Profile returned ${res.status}. Log in on Instagram, copy post links, or set INSTAGRAM_SESSION_ID in Vercel env.`,
      };
    }

    const html = await res.text();
    const codes = new Set<string>();
    for (const m of html.matchAll(/"shortcode":"([A-Za-z0-9_-]{8,12})"/g)) codes.add(m[1]);
    for (const m of html.matchAll(/instagram\.com\/p\/([A-Za-z0-9_-]+)/g)) codes.add(m[1]);

    if (codes.size > 0) {
      return {
        urls: [...codes].map((c) => instagramPermalink(c)),
        method: "html_scrape",
      };
    }

    return {
      urls: [],
      method: "none",
      error:
        "Could not read posts (Instagram login wall). Paste post URLs manually or add INSTAGRAM_SESSION_ID to Vercel env.",
    };
  } catch (e) {
    return {
      urls: [],
      method: "none",
      error: e instanceof Error ? e.message : "Discover failed",
    };
  }
}
