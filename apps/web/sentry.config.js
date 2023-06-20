import { environmentId } from './environment'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
const SENTRY_ENVIRONMENT = environmentId || process.env.NODE_ENV

const sentryConfig = {
  dsn: SENTRY_DSN || 'https://25eadef1cf0444c6bab1eec8d9acaacc@o949544.ingest.sentry.io/6396737',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.05,
  enabled: ['production'].includes(SENTRY_ENVIRONMENT),
  environment: SENTRY_ENVIRONMENT,
}

export default sentryConfig
