import * as Sentry from '@sentry/react-native'
import { LogBox } from 'react-native'

export const logError = (error: unknown, message?: string, stack?: string) => {
  const isDevEnvironment = process.env.NODE_ENV === 'development'
  const consoleLog = isDevEnvironment ? console.error : console.warn
  const errorMessage = message ? ` ${message}:` : ''

  LogBox.ignoreAllLogs()
  Sentry.captureException(error)

  consoleLog('[logError.ts]' + errorMessage, error, stack)
}
