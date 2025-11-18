const buckets = new Map<string, { count: number; reset: number }>();

export function rateLimit({ key, limit, windowMs }: { key: string; limit: number; windowMs: number }) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return { success: true };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { success: false, retryAfter: bucket.reset - now };
  }
  return { success: true };
}
