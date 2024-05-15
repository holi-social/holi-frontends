import { jest } from '@jest/globals'

export const withSilencedConsoleError = (fn: () => void) => {
  const originalConsoleError = global.console.error
  global.console.error = jest.fn()
  try {
    fn()
  } finally {
    global.console.error = originalConsoleError
  }
}
