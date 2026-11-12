/**
 * FinIQ In-Memory Sliding Window Rate Limiter
 * 
 * Provides rate-limiting protection for expensive AI endpoints (Gemini API)
 * and database mutation endpoints to prevent denial-of-service, runaway cost,
 * and malicious scraping.
 */

interface RateLimitRecord {
  timestamps: number[];
}

// Global in-memory storage for sliding window timestamps
const ipStore = new Map<string, RateLimitRecord>();

// Cleanup stale records periodically (every 10 minutes)
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupStaleEntries(ttlMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, record] of ipStore.entries()) {
    const fresh = record.timestamps.filter((ts) => now - ts < ttlMs);
    if (fresh.length === 0) {
      ipStore.delete(key);
    } else {
      record.timestamps = fresh;
    }
  }
}

export interface RateLimitOptions {
  /** Maximum requests permitted within windowMs */
  maxRequests: number;
  /** Sliding window duration in milliseconds */
  windowMs: number;
  /** Action / category identifier (e.g., 'chat', 'upload', 'quiz') */
  identifier: string;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

/**
 * Check and record a rate limit hit for a specific user/IP.
 * 
 * @param key Unique key for the rate limit subject (e.g. `userId` or IP)
 * @param options Configuration for rate limiting
 * @returns RateLimitResult with success boolean and remaining attempts
 */
export function rateLimit(
  key: string,
  options: RateLimitOptions
): RateLimitResult {
  cleanupStaleEntries(options.windowMs * 2);

  const now = Date.now();
  const compositeKey = `${options.identifier}:${key}`;
  const record = ipStore.get(compositeKey) || { timestamps: [] };

  // Remove timestamps that have aged out of the sliding window
  const validTimestamps = record.timestamps.filter(
    (timestamp) => now - timestamp < options.windowMs
  );

  if (validTimestamps.length >= options.maxRequests) {
    const oldest = validTimestamps[0];
    const resetMs = options.windowMs - (now - oldest);
    return {
      success: false,
      limit: options.maxRequests,
      remaining: 0,
      resetMs: Math.max(0, resetMs),
    };
  }

  // Record this hit
  validTimestamps.push(now);
  ipStore.set(compositeKey, { timestamps: validTimestamps });

  return {
    success: true,
    limit: options.maxRequests,
    remaining: options.maxRequests - validTimestamps.length,
    resetMs: options.windowMs,
  };
}

/** Pre-configured rate limit tiers for FinIQ */
export const RateLimits = {
  /** Gemini AI Chat: max 20 queries per 60 seconds */
  AI_CHAT: {
    identifier: "ai-chat",
    maxRequests: 20,
    windowMs: 60 * 1000,
  },
  /** Document Analysis / Ingestion: max 10 uploads per 60 seconds */
  DOCUMENT_ANALYZE: {
    identifier: "doc-analyze",
    maxRequests: 10,
    windowMs: 60 * 1000,
  },
  /** Investment Recommendations: max 10 generations per 60 seconds */
  RECOMMENDATIONS: {
    identifier: "recommendations",
    maxRequests: 10,
    windowMs: 60 * 1000,
  },
  /** Quiz Generation: max 15 quiz starts per 60 seconds */
  QUIZ_GENERATION: {
    identifier: "quiz-gen",
    maxRequests: 15,
    windowMs: 60 * 1000,
  },
  /** Startup Creation: max 30 creations per hour */
  STARTUP_CREATE: {
    identifier: "startup-create",
    maxRequests: 30,
    windowMs: 60 * 60 * 1000,
  },
} as const;
