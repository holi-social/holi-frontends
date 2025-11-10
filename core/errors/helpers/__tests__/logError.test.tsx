/* eslint-disable no-console */

import { HoliError } from '@holi/core/errors/classes/HoliError'
import { logError } from '@holi/core/errors/helpers'

const mockConsoleWarn = jest.fn()
const mockConsoleError = jest.fn()

global.console.warn = mockConsoleWarn
global.console.error = mockConsoleError

describe('logError', () => {
  const setContextMock = jest.fn()
  const setTagMock = jest.fn()
  const mockScope = { setContext: setContextMock, setTag: setTagMock }

  it('should track errors in sentry', () => {
    logError(new HoliError('Test'), 'some message', { location: 'Component.method' })

    expect(captureSentryException).toHaveBeenCalledWith(new HoliError('some message'), expect.any(Function))

    const scopeFunction = captureSentryException.mock.calls[0][1]
    scopeFunction(mockScope)

    expect(setContextMock).toHaveBeenCalledWith('Error Context', {
      location: 'Component.method',
    })
  })

  it('should add context to sentry expection if given', () => {
    logError(new HoliError('Test'), 'some message', { location: 'Component.method', stack: 'some stack', test: 1 })

    expect(captureSentryException).toHaveBeenCalledWith(new HoliError('some message'), expect.any(Function))
    // sadly, we cannot test if the cause is sent to sentry, because the matcher does not deep match Errors
    // https://jestjs.io/docs/expect#toequalvalue

    const scopeFunction = captureSentryException.mock.calls[0][1]
    scopeFunction(mockScope)

    expect(setContextMock).toHaveBeenCalledWith('Error Context', {
      location: 'Component.method',
      stack: 'some stack',
      test: 1,
    })
  })

  it('should call console.warn on production', () => {
    logError(new HoliError('Test'), 'some message', { location: 'Component.method', stack: 'some stack' })
    expect(console.warn).toHaveBeenCalledWith('[Component.method] some message', new HoliError('Test'), {
      stack: 'some stack',
    })
  })

  it('should call console.error on development', () => {
    // @ts-ignore
    process.env.NODE_ENV = 'development'
    logError(new HoliError('Test'), 'some message', { location: 'Component.method', stack: 'some stack' })

    expect(console.error).toHaveBeenCalledWith('[Component.method] some message', new HoliError('Test'), {
      stack: 'some stack',
    })
  })
})
