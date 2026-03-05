export const runtimeConfig = {
  isProd: process.env.NODE_ENV === 'production',
  debug: process.env.NODE_ENV !== 'production' && process.env.DEBUG !== 'false',
  logLevel: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'warn' : 'debug'),
  rateLimit: {
    enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
    maxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 120),
  },
  cache: {
    enabled: process.env.CACHE_ENABLED !== 'false',
    publicApiMaxAge: Number(process.env.PUBLIC_API_CACHE_MAX_AGE || 60),
    publicApiSMaxAge: Number(process.env.PUBLIC_API_CACHE_S_MAX_AGE || 300),
    publicApiStaleWhileRevalidate: Number(process.env.PUBLIC_API_CACHE_STALE || 600),
  },
} as const;

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
