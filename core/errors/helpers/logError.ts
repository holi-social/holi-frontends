import * as Sentry from '@sentry/react-native'

export const logError = (error: Error, message?: string, stack?: string) => {
  const errorMessage = message ? ` ${message}:` : ''
  console.error('[logError.ts]' + errorMessage, error, stack)
  Sentry.captureException(error)
}
