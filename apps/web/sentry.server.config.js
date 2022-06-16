// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
const SENTRY_ENVIRONMENT = process.env.SENTRY_ENVIRONMENT || process.env.NODE_ENV

Sentry.init({
  dsn: SENTRY_DSN || 'https://25eadef1cf0444c6bab1eec8d9acaacc@o949544.ingest.sentry.io/6396737',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1.0,
  enabled: !['development', 'test'].includes(SENTRY_ENVIRONMENT),
  environment: SENTRY_ENVIRONMENT,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
})
