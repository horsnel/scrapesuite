interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();

const PLAN_LIMITS: Record<string, number> = {
  free: 100,
  pro: 10000,
  business: Infinity,
};

export function checkRateLimit(
  userId: string,
  plan: string
): { allowed: boolean; remaining: number; limit: number } {
  const now = Date.now();
  const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

  // Reset monthly (30 days)
  const resetPeriod = 30 * 24 * 60 * 60 * 1000;

  const entry = rateLimitMap.get(userId);

  if (!entry || now > entry.resetTime) {
    // New period
    rateLimitMap.set(userId, {
      count: 1,
      resetTime: now + resetPeriod,
    });

    return {
      allowed: true,
      remaining: limit === Infinity ? Infinity : limit - 1,
      limit,
    };
  }

  if (limit === Infinity) {
    entry.count++;
    return {
      allowed: true,
      remaining: Infinity,
      limit: Infinity,
    };
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      limit,
    };
  }

  entry.count++;
  return {
    allowed: true,
    remaining: limit - entry.count,
    limit,
  };
}
