import * as Sentry from '@sentry/react-native'

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
  const isDevEnvironment = process.env.NODE_ENV === 'development'
  // `console.error` is being thrown by React Native ExceptionManager in
  // production builds. We left it for development to recognize the urgency to
  // fix the error during development.
  // eslint-disable-next-line no-console
  const consoleLog = isDevEnvironment ? console.error : console.warn
  const errorMessage = message ? ` ${message}:` : ''

  consoleLog('[logError.ts]' + errorMessage, error, stack)
}
