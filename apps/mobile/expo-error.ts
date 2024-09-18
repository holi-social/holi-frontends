/**
 * A general error class that should be used for all errors in Expo modules.
 * Guarantees a `code` field that can be used to differentiate between different
 * types of errors without further subclassing Error.
 */

// this one is needed because expo moved this class out of their main package
export class CodedError extends Error {
  code: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  info?: any

  constructor(code: string, message: string) {
    super(message)
    this.code = code
  }
}
