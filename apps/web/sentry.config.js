import { EnvironmentId } from '@holi/core/helpers/models/EnvironmentId'

import { environmentId } from './environment'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN

const sentryConfig = {
  dsn: SENTRY_DSN || 'https://25eadef1cf0444c6bab1eec8d9acaacc@o949544.ingest.sentry.io/6396737',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.3,
  tracePropagationTargets: ['localhost', /^\//, 'dev.holi.social', 'app.holi.social'],
  enabled: [EnvironmentId.STAGING, EnvironmentId.PRODUCTION].includes(environmentId),
  environment: environmentId,
}

export default sentryConfig
