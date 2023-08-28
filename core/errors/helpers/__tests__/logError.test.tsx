/* eslint-disable no-console */
import { jest } from '@jest/globals'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError } from '@holi/core/errors/helpers'

const mockConsoleWarn = jest.fn()
const mockConsoleError = jest.fn()

global.console.warn = mockConsoleWarn
global.console.error = mockConsoleError

it('should track errors in sentry', () => {
  logError(new HoliError('Test'), 'some message', 'some stack')

  expect(captureSentryException).toHaveBeenCalledWith(new HoliError('Test'))
})

it('should call console.warn on production', () => {
  logError(new HoliError('Test'), 'some message', 'some stack')
  expect(mockConsoleWarn).toHaveBeenCalledWith('[logError.ts] some message:', new HoliError('Test'), 'some stack')
})

it('should call console.error on development', () => {
  // @ts-ignore
  process.env.NODE_ENV = 'development'
  logError(new HoliError('Test'), 'some message', 'some stack')

  expect(mockConsoleError).toHaveBeenCalledWith('[logError.ts] some message:', new HoliError('Test'), 'some stack')
})
