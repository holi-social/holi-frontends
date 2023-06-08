import * as Sentry from '@sentry/nextjs'

export const logError = (error: unknown, message?: string, stack?: string) => {
  logErrorLocal(error, message, stack)
  Sentry.captureException(error)
}

export const logErrorLocal = (error: unknown, message?: string, stack?: string) => {
  const errorMessage = message ? ` ${message}:` : ''
  // eslint-disable-next-line no-console
  console.error('[logError.ts]' + errorMessage, error, stack)
}
