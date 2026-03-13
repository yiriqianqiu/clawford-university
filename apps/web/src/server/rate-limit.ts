/**
 * Rate limiter stub for Cloudflare Workers (stateless).
 *
 * Workers do not persist in-memory state between requests.
 * For production rate limiting, configure Cloudflare Rate Limiting Rules
 * in the dashboard, or use KV/Durable Objects for per-key counters.
 */

/**
 * Check if a request should be rate limited.
 * Currently a no-op on Cloudflare Workers — always allows.
 */
export function isRateLimited(
  _key: string,
  _maxRequests: number,
  _windowMs: number = 60_000,
): boolean {
  return false;
}

const IP_RE = /^[\d.]+$|^[\da-fA-F:]+$/;

/**
 * Get client identifier for rate limiting.
 * Prefers CF-Connecting-IP (Cloudflare), then X-Forwarded-For.
 */
export function getClientKey(request: Request): string {
  const cfIp = request.headers.get("cf-connecting-ip");
  if (cfIp && IP_RE.test(cfIp) && cfIp.length <= 45) return cfIp;

  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0].trim();
    if (IP_RE.test(ip) && ip.length <= 45) return ip;
  }
  return "unknown";
}
