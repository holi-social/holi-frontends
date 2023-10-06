import * as Sentry from '@sentry/nextjs'

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

export const logError = (error: unknown, message: string, context: ErrorContext) => {
  if (isNetworkConnectionError(error)) return
  logErrorLocal(error, message, context)
  Sentry.captureException(error, (scope) => {
    scope.setContext('Error Context', context)
    return scope
  })
}

export const logErrorLocal = (error: unknown, message: string, { location, ...context }: ErrorContext) => {
  if (isNetworkConnectionError(error)) return
  const errorMessage = message ? ` ${message}:` : ''
  // eslint-disable-next-line no-console
  console.error(`[${location}] ` + errorMessage, error, context)
}
