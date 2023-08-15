import * as Sentry from '@sentry/nextjs'

export const logInfo = (error: unknown, message?: string) => {
  const errorMessage = message ? ` ${message}:` : ''
  // eslint-disable-next-line no-console
  console.info('[logError.ts]' + errorMessage, error)
}

export const logInfoMsg = (message: string) => {
  // eslint-disable-next-line no-console
  console.info('[logError.ts]' + message)
}

export const logError = (error: unknown, message?: string, stack?: string) => {
  logErrorLocal(error, message, stack)
  Sentry.captureException(error)
}

export const logErrorLocal = (error: unknown, message?: string, stack?: string) => {
  const errorMessage = message ? ` ${message}:` : ''
  // eslint-disable-next-line no-console
  console.error('[logError.ts]' + errorMessage, error, stack)
}
