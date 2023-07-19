import { EnvionmentId, environmentId } from './environment'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

const sentryConfig = {
  dsn: SENTRY_DSN || 'https://25eadef1cf0444c6bab1eec8d9acaacc@o949544.ingest.sentry.io/6396737',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: environmentId == EnvionmentId.PRODUCTION ? 0.1 : 1,
  tracePropagationTargets: ['localhost', /^\//, 'holi.social'],
  enabled: [EnvionmentId.STAGING, EnvionmentId.PRODUCTION].includes(environmentId),
  environment: environmentId,
}

export default sentryConfig
