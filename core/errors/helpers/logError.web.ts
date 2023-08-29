import * as Sentry from '@sentry/nextjs'

import { ErrorInfo } from '@holi/core/errors/helpers/logError.shared'

export const logInfo = (error: unknown, message?: string) => {
  const errorMessage = message ? ` ${message}:` : ''
  // eslint-disable-next-line no-console
  console.info('[logError.ts]' + errorMessage, error)
}

export const logInfoMsg = (message: string) => {
  // eslint-disable-next-line no-console
  console.info('[logError.ts]' + message)
}

export const logError = (error: unknown, message?: string, { stack, context }: ErrorInfo = {}) => {
  logErrorLocal(error, message, stack)
  Sentry.captureException(error, (scope) => {
    if (stack) {
      scope.setContext('Stack', { stack })
    }
    if (context) {
      scope.setContext('Error Context', context)
    }
    return scope
  })
}

export const logErrorLocal = (error: unknown, message?: string, stack?: string) => {
  const errorMessage = message ? ` ${message}:` : ''
  // eslint-disable-next-line no-console
  console.error('[logError.ts]' + errorMessage, error, stack)
}
