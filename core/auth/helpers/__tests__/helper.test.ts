/* eslint-disable no-console */
import {
  type GenericAxiosError,
  getBrowserRedirect,
  handleKratosSdkError,
  handleKratosSdkErrorIgnoringCodes,
} from '@holi/core/auth/helpers/helper'
import { HoliError } from '@holi/core/errors/classes/HoliError'

const mockConsoleWarn = jest.fn()
global.console.warn = mockConsoleWarn

const errorDetails = {
  id: 'session_inactive',
  code: 401,
  status: 'Unauthorized',
  request: 'be72e69f-32ad-91d3-840a-6d56fe836190',
  reason: 'No active session was found in this request.',
  message: 'request does not have a valid authentication session',
}
const filteredDetails = {
  id: 'session_inactive',
  code: 401,
  status: 'Unauthorized',
  reason: 'No active session was found in this request.',
}
const errorResponse = {
  response: {
    data: {
      error: errorDetails,
    },
  },
} as GenericAxiosError
const generalError = {
  response: {
    status: 500,
    statusText: 'Internal server error',
  },
} as GenericAxiosError

describe('auth helpers', () => {
  describe('handleKratosSdkError', () => {
    const errorHandler = handleKratosSdkError('createBrowserLogoutFlow')
    const errorHandlerIgnoringCodes = handleKratosSdkErrorIgnoringCodes('createBrowserLogoutFlow', {
      errorCodesToIgnore: ['session_inactive'],
    })

    it('adds context information to log message', () => {
      expect(() => errorHandler(errorResponse)).toThrow()

      expect(console.warn).toHaveBeenCalledWith(
        '[handleKratosSdkError] Error from kratosSdk: No active session was found in this request.',
        errorResponse,
        {
          ...filteredDetails,
          method: 'kratosSdk.createBrowserLogoutFlow',
        }
      )
    })

    it('adds context information to sentry exception', () => {
      expect(() => errorHandler(errorResponse)).toThrow()

      const holiError = new HoliError('Error from kratosSdk: No active session was found in this request.')
      expect(captureSentryException).toHaveBeenCalledWith(holiError, expect.any(Function))

      const scopeFunction = captureSentryException.mock.calls[0][1]
      const setTagMock = jest.fn()
      const setContextMock = jest.fn()
      scopeFunction({ setTag: setTagMock, setContext: setContextMock })

      expect(setContextMock).toHaveBeenCalledWith('Error Context', {
        ...filteredDetails,
        method: 'kratosSdk.createBrowserLogoutFlow',
        location: 'handleKratosSdkError',
      })
    })

    it('ignores specified errors', () => {
      expect(() => errorHandlerIgnoringCodes(errorResponse)).not.toThrow()

      expect(console.warn).not.toHaveBeenCalled()
      expect(captureSentryException).not.toHaveBeenCalled()
    })

    it('does not log or report errors with status code 400', () => {
      expect(() => errorHandler({ response: { status: 400 } } as GenericAxiosError)).toThrow()

      expect(console.warn).not.toHaveBeenCalled()
      expect(captureSentryException).not.toHaveBeenCalled()
    })

    it('does not log or report browser redirects', () => {
      expect(() =>
        errorHandler({
          isAxiosError: true,
          response: {
            status: 422,
            data: {
              error: { id: 'browser_location_change_required' },
              redirect_browser_to: 'someUrl',
            },
          },
        } as unknown as GenericAxiosError)
      ).toThrow()

      expect(console.warn).not.toHaveBeenCalled()
      expect(captureSentryException).not.toHaveBeenCalled()
    })

    it('handles general errors', () => {
      expect(() => errorHandler(generalError)).toThrow()

      expect(console.warn).toHaveBeenCalledWith(
        '[handleKratosSdkError] Error from kratosSdk: Internal server error',
        generalError,
        { method: 'kratosSdk.createBrowserLogoutFlow' }
      )
    })

    it('adds context information to sentry exception for general errors', () => {
      expect(() => errorHandler(generalError)).toThrow()

      const holiError = new HoliError('Error from kratosSdk: Internal server error')
      expect(captureSentryException).toHaveBeenCalledWith(holiError, expect.any(Function))

      const error = captureSentryException.mock.calls[0][0]
      expect(error).toStrictEqual(holiError)
      expect(error.cause).toStrictEqual(generalError)
      const scopeFunction = captureSentryException.mock.calls[0][1]

      const setTagMock = jest.fn()
      const setContextMock = jest.fn()
      scopeFunction({ setTag: setTagMock, setContext: setContextMock })

      expect(setContextMock).toHaveBeenCalledWith('Error Context', {
        location: 'handleKratosSdkError',
        method: 'kratosSdk.createBrowserLogoutFlow',
      })
    })
  })

  describe('getBrowserRedirect', () => {
    it('returns undefined, when not an AxiosError', () => {
      expect(getBrowserRedirect({})).toBeUndefined()
    })

    it('returns a redirect URL, when a well formated Ory Error response is found', () => {
      expect(
        getBrowserRedirect({
          isAxiosError: true,
          response: {
            status: 422,
            data: {
              error: { id: 'browser_location_change_required' },
              redirect_browser_to: 'someUrl',
            },
          },
        })
      ).toBe('someUrl')
    })
  })
})
