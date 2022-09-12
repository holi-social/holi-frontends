import { logError } from '@holi/core/errors/helpers'

describe('logs errors correctly', () => {
  it('logs and tracks error with sentry', () => {
    logError(new Error('Test'), 'some message', 'some stack')

    expect(console.error).toHaveBeenCalledWith('[logError.ts] some message:', new Error('Test'), 'some stack')
    expect(captureSentryException).toHaveBeenCalledWith(new Error('Test'))
  })
})
