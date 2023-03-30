import * as Sentry from '@sentry/react-native'

export const logError = (error: Error, message?: string, stack?: string) => {
  Sentry.captureException(error)

  const isDevEnvironment = process.env.NODE_ENV === 'development'
  // `console.error` is being thrown by React Native ExceptionManager in
  // production builds. We left it for development to recognize the urgency to
  // fix the error during development.
  const consoleLog = isDevEnvironment ? console.error : console.warn
  const errorMessage = message ? ` ${message}:` : ''

  consoleLog('[logError.ts]' + errorMessage, error, stack)
}
