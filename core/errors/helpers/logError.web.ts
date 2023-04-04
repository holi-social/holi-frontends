import * as Sentry from '@sentry/nextjs'

export const logError = (error: unknown, message?: string, stack?: string) => {
  const errorMessage = message ? ` ${message}:` : ''
  console.error('[logError.ts]' + errorMessage, error, stack)
  Sentry.captureException(error)
}
