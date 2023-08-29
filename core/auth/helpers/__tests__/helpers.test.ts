/* eslint-disable no-console */
import { handleKratosSdkError } from '@holi/core/auth/helpers/helper'

const errorDetails = {
  id: 'session_inactive',
  code: 401,
  status: 'Unauthorized',
  request: 'be72e69f-32ad-91d3-840a-6d56fe836190',
  reason: 'No active session was found in this request.',
  message: 'request does not have a valid authentication session',
}
const errorResponse = {
  response: {
    data: {
      error: errorDetails,
    },
  },
}

describe('handleKratosSdkError', () => {
  const errorHandler = handleKratosSdkError('createBrowserLogoutFlow')
  const errorHandlerIgnoringCodes = handleKratosSdkError('createBrowserLogoutFlow', {
    errorCodesToIgnore: ['session_inactive'],
  })

  it('adds context information to log message', () => {
    expect(() => errorHandler(errorResponse)).toThrow()

    expect(console.warn).toHaveBeenCalledWith(
      '[logError.ts] [kratosSdk.createBrowserLogoutFlow] No active session was found in this request.:',
      errorResponse,
      undefined
    )
  })

  it('adds context information to sentry exception', () => {
    expect(() => errorHandler(errorResponse)).toThrow()

    expect(captureSentryException).toHaveBeenCalledWith(errorResponse, expect.any(Function))

    const scopeFunction = captureSentryException.mock.calls[0][1]
    const setContextMock = jest.fn()
    scopeFunction({ setContext: setContextMock })

    expect(setContextMock).toHaveBeenCalledWith('Error Context', {
      ...errorDetails,
      method: 'kratosSdk.createBrowserLogoutFlow',
    })
  })

  it('ignores specified errors', () => {
    expect(() => errorHandlerIgnoringCodes(errorResponse)).not.toThrow()

    expect(console.warn).not.toHaveBeenCalled()
    expect(captureSentryException).not.toBeCalled()
  })
})
