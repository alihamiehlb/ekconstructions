let cachedToken: string | null = null;

export async function getCsrfToken(): Promise<string> {
  if (cachedToken) return cachedToken;
  const res = await fetch("/api/csrf", { credentials: "same-origin" });
  if (!res.ok) throw new Error("Could not fetch CSRF token");
  const data = (await res.json()) as { token: string };
  cachedToken = data.token;
  return data.token;
}

export function clearCsrfCache() {
  cachedToken = null;
}

export async function secureJsonFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const token = await getCsrfToken();
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  headers.set("X-CSRF-Token", token);

  return fetch(url, {
    ...init,
    credentials: "same-origin",
    headers,
  });
}

/** Multipart upload with CSRF (no JSON content-type). */
export async function secureFormFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const token = await getCsrfToken();
  const headers = new Headers(init.headers);
  headers.set("X-CSRF-Token", token);

  return fetch(url, {
    ...init,
    credentials: "same-origin",
    headers,
  });
}
