import type { GraphQLError } from 'graphql'

import { extractFieldErrors, isGraphQLErrorOfType, isForbiddenError, isNotFoundError } from '@holi/core/errors/helpers'

const createGraphQLError = (extensions = {}): GraphQLError =>
  ({
    extensions,
    name: '',
    message: '',
  }) as GraphQLError

describe('apolloUtils', () => {
  const badUserInputError = createGraphQLError({ code: 'BAD_USER_INPUT' })
  const notFoundError = createGraphQLError({ code: 'NOT_FOUND' })
  const forbiddenError = createGraphQLError({ code: 'FORBIDDEN' })

  it('checks for given error type', () => {
    expect(isGraphQLErrorOfType({ graphQLErrors: [] }, ['BAD_USER_INPUT'])).toBeFalsy()
    expect(isGraphQLErrorOfType({ graphQLErrors: [badUserInputError] }, ['BAD_USER_INPUT'])).toBeTruthy()
    expect(isGraphQLErrorOfType({ graphQLErrors: [notFoundError] }, ['BAD_USER_INPUT'])).toBeFalsy()
    expect(isGraphQLErrorOfType({ graphQLErrors: [notFoundError, badUserInputError] }, ['BAD_USER_INPUT'])).toBeTruthy()
  })

  it('checks for not found errors', () => {
    expect(isNotFoundError({ graphQLErrors: [] })).toBeFalsy()
    expect(isNotFoundError({ graphQLErrors: [badUserInputError] })).toBeFalsy()
    expect(isNotFoundError({ graphQLErrors: [notFoundError] })).toBeTruthy()
    expect(isNotFoundError({ graphQLErrors: [badUserInputError, notFoundError] })).toBeTruthy()
  })

  it('checks for forbidden errors', () => {
    expect(isForbiddenError({ graphQLErrors: [] })).toBeFalsy()
    expect(isForbiddenError({ graphQLErrors: [badUserInputError] })).toBeFalsy()
    expect(isForbiddenError({ graphQLErrors: [forbiddenError] })).toBeTruthy()
    expect(isForbiddenError({ graphQLErrors: [badUserInputError, forbiddenError] })).toBeTruthy()
  })

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
    const result = extractFieldErrors({ graphQLErrors: [error] })
    expect(result).toEqual(fieldErrors)
  })

  it('returns undefined when there are no field errors', () => {
    expect(extractFieldErrors({ graphQLErrors: [] })).toBeUndefined()
    expect(extractFieldErrors({ graphQLErrors: [createGraphQLError()] })).toBeUndefined()
  })

  it('returns undefined when JSON parsing fails', () => {
    const error = createGraphQLError({ errors: 'foobar' })
    const result = extractFieldErrors({ graphQLErrors: [error] })
    expect(result).toBeUndefined()
  })
})
