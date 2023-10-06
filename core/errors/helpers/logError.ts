import * as Sentry from '@sentry/react-native'

import { ErrorContext, isNetworkConnectionError } from '@holi/core/errors/helpers/logError.shared'

export const logInfo = (error: unknown, message?: string) => {
  const errorMessage = message ? ` ${message}:` : ''
  // eslint-disable-next-line no-console
  console.info('[logError.ts]' + errorMessage, error)
}

export const logInfoMsg = (message: string) => {
  // eslint-disable-next-line no-console
  console.info('[logError.ts]' + message)
}

/**
 * Helper function to log an error and send it to Sentry. You can pass optional
 * parameters to add an additional log message, a stack trace or an object
 * containing more information about the error context that would be send to
 * Sentry as well.
 *
 * (!) Make sure to never log or pass any user identifiable data.
 */
export const logError = (error: unknown, logMessage: string, context: ErrorContext) => {
  if (isNetworkConnectionError(error)) return
  logErrorLocal(error, logMessage, context)
  Sentry.captureException(error, (scope) => {
    scope.setContext('Error Context', context)
    return scope
  })
}

export const logErrorLocal = (error: unknown, logMessage: string, { location, ...context }: ErrorContext) => {
  if (isNetworkConnectionError(error)) return
  const isDevEnvironment = process.env.NODE_ENV === 'development'
  // `console.error` is being thrown by React Native ExceptionManager in
  // production builds. We left it for development to recognize the urgency to
  // fix the error during development.
  // eslint-disable-next-line no-console
  const consoleLog = isDevEnvironment ? console.error : console.warn

  consoleLog(`[${location}] ` + logMessage, error, context)
}
