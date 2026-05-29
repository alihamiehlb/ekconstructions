type Entry = { count: number; reset: number };

const buckets = new Map<string, Entry>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  const entry = buckets.get(key);

  if (!entry || now > entry.reset) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { allowed: true, remaining: max - 1, resetAt: now + windowMs };
  }

  entry.count += 1;
  const allowed = entry.count <= max;
  return {
    allowed,
    remaining: Math.max(0, max - entry.count),
    resetAt: entry.reset,
  };
}

export function rateLimitResponse(retryAfterSec: number) {
  return {
    error: "Too many requests. Please try again later.",
    retryAfter: retryAfterSec,
  };
}
