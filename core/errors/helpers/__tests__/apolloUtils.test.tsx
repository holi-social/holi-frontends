import type { GraphQLError } from 'graphql'

import {
  extractFieldErrors,
  isGraphQLErrorOfType,
  isForbiddenError,
  isNotFoundError,
  isMaliciousUrlError,
  isServerError,
  isUnauthorizedError,
} from '@holi/core/errors/helpers'
import {
  CombinedGraphQLErrors,
  CombinedProtocolErrors,
  type ErrorLike,
  ServerError,
  ServerParseError,
} from '@apollo/client'

const createGraphQLError = (extensions = {}): GraphQLError =>
  ({
    extensions,
    name: '',
    message: '',
  }) as GraphQLError

const createServerError = (statusCode: number) =>
  new ServerError('test error', {
    response: new Response(undefined, { status: statusCode }),
    bodyText: '',
  })

type ErrorTestData = [ErrorLike, boolean][]

describe('apolloUtils', () => {
  const badUserInputGraphQLError = createGraphQLError({ code: 'BAD_USER_INPUT' })
  const emptyErrors = new CombinedGraphQLErrors({ errors: [] })
  const badUserInputError = new CombinedGraphQLErrors({ errors: [badUserInputGraphQLError] })
  const protocolError = new CombinedProtocolErrors([])
  const serverParseError = new ServerParseError(new Error('Test'), {
    response: new Response(undefined, { status: 400 }),
    bodyText: '',
  })

  describe('isGraphQLErrorOfType', () => {
    const notFoundGraphQLError = createGraphQLError({ code: 'NOT_FOUND' })
    const forbiddenGraphQLError = createGraphQLError({ code: 'FORBIDDEN' })
    const maliciousUrlGraphQLError = createGraphQLError({ code: 'MALICIOUS_URL' })
    const notFoundError = new CombinedGraphQLErrors({ errors: [notFoundGraphQLError] })
    const forbiddenError = new CombinedGraphQLErrors({ errors: [forbiddenGraphQLError] })
    const maliciousUrlError = new CombinedGraphQLErrors({ errors: [maliciousUrlGraphQLError] })
    const notFoundAndBadUserInputErrors = new CombinedGraphQLErrors({
      errors: [notFoundGraphQLError, badUserInputGraphQLError],
    })
    const forbiddenAndBadUserInputErrors = new CombinedGraphQLErrors({
      errors: [badUserInputGraphQLError, forbiddenGraphQLError],
    })

    const badUserInputTestData: ErrorTestData = [
      [emptyErrors, false],
      [badUserInputError, true],
      [notFoundError, false],
      [forbiddenError, false],
      [maliciousUrlError, false],
      [notFoundAndBadUserInputErrors, true],
      [forbiddenAndBadUserInputErrors, true],
      [protocolError, false],
      [serverParseError, false],
      [createServerError(400), false],
    ]
    it.each(badUserInputTestData)('checks for given error type', (error, expectedResult) => {
      expect(isGraphQLErrorOfType(error, ['BAD_USER_INPUT'])).toEqual(expectedResult)
    })

    const notFoundTestData: ErrorTestData = [
      [emptyErrors, false],
      [badUserInputError, false],
      [notFoundError, true],
      [forbiddenError, false],
      [maliciousUrlError, false],
      [notFoundAndBadUserInputErrors, true],
      [forbiddenAndBadUserInputErrors, false],
      [protocolError, false],
      [serverParseError, false],
      [createServerError(400), false],
    ]
    it.each(notFoundTestData)('checks for not found errors', (error, expectedResult) => {
      expect(isNotFoundError(error)).toEqual(expectedResult)
    })

    const forbiddenTestData: ErrorTestData = [
      [emptyErrors, false],
      [badUserInputError, false],
      [notFoundError, false],
      [forbiddenError, true],
      [maliciousUrlError, false],
      [notFoundAndBadUserInputErrors, false],
      [forbiddenAndBadUserInputErrors, true],
      [protocolError, false],
      [serverParseError, false],
      [createServerError(400), false],
    ]
    it.each(forbiddenTestData)('checks for forbidden errors', (error, expectedResult) => {
      expect(isForbiddenError(error)).toEqual(expectedResult)
    })

    const maliciousUrlTestData: ErrorTestData = [
      [emptyErrors, false],
      [badUserInputError, false],
      [notFoundError, false],
      [forbiddenError, false],
      [maliciousUrlError, true],
      [notFoundAndBadUserInputErrors, false],
      [forbiddenAndBadUserInputErrors, false],
      [protocolError, false],
      [serverParseError, false],
      [createServerError(400), false],
    ]
    it.each(maliciousUrlTestData)('checks for malicious url errors', (error, expectedResult) => {
      expect(isMaliciousUrlError(error)).toEqual(expectedResult)
    })
  })

  describe('extractFieldErrors', () => {
    it('extracts field errors', () => {
      const fieldErrors = {
        title: [{ code: 'min_length', message: 'Title is too short.' }],
        description: [{ code: 'max_length', message: 'Description is too long.' }],
      }
      const error = createGraphQLError({
        code: 'BAD_USER_INPUT',
        message: 'Bad user input',
        errors: JSON.stringify(fieldErrors),
      })
      const result = extractFieldErrors(new CombinedGraphQLErrors({ errors: [error] }))
      expect(result).toEqual(fieldErrors)
    })

    const invalidFieldErrorTestData: ErrorLike[] = [
      emptyErrors,
      new CombinedGraphQLErrors({ errors: [createGraphQLError()] }),
      protocolError,
      serverParseError,
      createServerError(400),
    ]
    it.each(invalidFieldErrorTestData)('returns undefined when there are no field errors', (error) => {
      expect(extractFieldErrors(error)).toBeUndefined()
    })

    it('returns undefined when JSON parsing fails', () => {
      const error = createGraphQLError({ errors: 'foobar' })
      const result = extractFieldErrors(new CombinedGraphQLErrors({ errors: [error] }))
      expect(result).toBeUndefined()
    })
  })

  describe('isServerError', () => {
    const serverErrorTestData: ErrorTestData = [
      [emptyErrors, false],
      [badUserInputError, false],
      [protocolError, false],
      [serverParseError, false],
      [createServerError(400), true],
      [createServerError(500), true],
    ]
    it.each(serverErrorTestData)('checks for server error', (error, expectedResult) => {
      expect(isServerError(error)).toEqual(expectedResult)
    })

    const unauthorizedTestData: ErrorTestData = [
      [emptyErrors, false],
      [badUserInputError, false],
      [protocolError, false],
      [serverParseError, false],
      [createServerError(401), true],
      [createServerError(500), false],
    ]
    it.each(unauthorizedTestData)('checks for unauthorized error', (error, expectedResult) => {
      expect(isUnauthorizedError(error)).toEqual(expectedResult)
    })
  })
})
