/* eslint-disable no-console */
import { jest } from '@jest/globals'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError } from '@holi/core/errors/helpers'

const mockConsoleWarn = jest.fn()
const mockConsoleError = jest.fn()

global.console.warn = mockConsoleWarn
global.console.error = mockConsoleError

describe('logError', () => {
  const setContextMock = jest.fn()
  const mockScope = { setContext: setContextMock }

  it('should track errors in sentry', () => {
    logError(new HoliError('Test'), 'some message', { stack: 'some stack' })

    expect(captureSentryException).toHaveBeenCalledWith(new HoliError('Test'), expect.any(Function))

    const scopeFunction = captureSentryException.mock.calls[0][1]
    scopeFunction(mockScope)

    expect(setContextMock).toHaveBeenCalledWith('Stack', {
      stack: 'some stack',
    })
  })

  it('should add context to sentry expection if given', () => {
    logError(new HoliError('Test'), 'some message', { stack: 'some stack', context: { test: 1 } })

    expect(captureSentryException).toHaveBeenCalledWith(new HoliError('Test'), expect.any(Function))

    const scopeFunction = captureSentryException.mock.calls[0][1]
    scopeFunction(mockScope)

    expect(setContextMock).toHaveBeenCalledWith('Stack', {
      stack: 'some stack',
    })
    expect(setContextMock).toHaveBeenCalledWith('Error Context', {
      test: 1,
    })
  })

  it('should call console.warn on production', () => {
    logError(new HoliError('Test'), 'some message', { stack: 'some stack' })
    expect(console.warn).toHaveBeenCalledWith('[logError.ts] some message:', new HoliError('Test'), 'some stack')
  })

  it('should call console.error on development', () => {
    // @ts-ignore
    process.env.NODE_ENV = 'development'
    logError(new HoliError('Test'), 'some message', { stack: 'some stack' })

    expect(console.error).toHaveBeenCalledWith('[logError.ts] some message:', new HoliError('Test'), 'some stack')
  })
})
