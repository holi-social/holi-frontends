import { logError } from '@holi/core/errors/helpers'

it('should track errors in sentry', () => {
  logError(new Error('Test'), 'some message', 'some stack')

  expect(captureSentryException).toHaveBeenCalledWith(new Error('Test'))
})

it('should call console.warn on production', () => {
  logError(new Error('Test'), 'some message', 'some stack')
  expect(console.warn).toHaveBeenCalledWith('[logError.ts] some message:', new Error('Test'), 'some stack')
})

it('should call console.error on development', () => {
  // @ts-ignore
  process.env.NODE_ENV = 'development'
  logError(new Error('Test'), 'some message', 'some stack')

  expect(console.error).toHaveBeenCalledWith('[logError.ts] some message:', new Error('Test'), 'some stack')
})
