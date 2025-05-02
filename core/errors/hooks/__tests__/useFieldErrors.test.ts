import { renderHook } from '@testing-library/react-hooks'
import type { GraphQLError } from 'graphql'

import type { FieldErrors } from '@holi/core/errors/helpers'
import { useFieldErrors } from '@holi/core/errors/hooks/useFieldErrors'
import { HoliToastType } from '@holi/ui/components/molecules/HoliToastProvider'

const mockI18nExists = jest.fn(() => true)
jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      exists: mockI18nExists,
    },
    t: (key: string) => key,
  }),
}))

const testFieldErrors: FieldErrors = {
  title: [
    { code: 'blank', message: 'Title may not be blank.' },
    { code: 'min_length', message: 'Title is too short.' },
  ],
  description: [{ code: 'max_length', message: 'Description is too long.' }],
}
const graphQlError: GraphQLError = {
  extensions: { errors: JSON.stringify(testFieldErrors) },
  locations: undefined,
  path: undefined,
  nodes: undefined,
  source: undefined,
  positions: undefined,
  originalError: undefined,
  name: '',
  message: '',
  toJSON: jest.fn(),
  [Symbol.toStringTag]: '',
}

describe('useFieldErrors', () => {
  beforeEach(() => {
    mockI18nExists.mockReturnValue(true)
  })

  it('correctly translates errors with default i18n prefix', () => {
    const { result } = renderHook(() => useFieldErrors())
    const translatedErrors = result.current.translateFieldErrors(testFieldErrors)

    expect(translatedErrors.title).toEqual(['global.validation.title.blank', 'global.validation.title.min_length'])
    expect(translatedErrors.description).toEqual(['global.validation.description.max_length'])
  })

  it('correctly translates errors with custom i18n prefix', () => {
    const { result } = renderHook(() => useFieldErrors({ i18nPrefix: 'spaces' }))
    const translatedErrors = result.current.translateFieldErrors(testFieldErrors)

    expect(translatedErrors.title).toEqual(['spaces.validation.title.blank', 'spaces.validation.title.min_length'])
    expect(translatedErrors.description).toEqual(['spaces.validation.description.max_length'])
  })

  it('uses message if no translation was found', () => {
    mockI18nExists.mockReturnValue(false)
    const { result } = renderHook(() => useFieldErrors())
    const translatedErrors = result.current.translateFieldErrors(testFieldErrors)

    expect(translatedErrors.title).toEqual(['Title may not be blank.', 'Title is too short.'])
    expect(translatedErrors.description).toEqual(['Description is too long.'])
  })

  it('returns translated field errors', () => {
    const { result } = renderHook(() => useFieldErrors())
    const translatedErrors = result.current.handleGraphQLError({
      graphQLErrors: [graphQlError],
      message: 'Bad user input',
    })

    expect(translatedErrors.title).toEqual(['global.validation.title.blank', 'global.validation.title.min_length'])
    expect(translatedErrors.description).toEqual(['global.validation.description.max_length'])
  })

  it('displays toasts for all unhandled field errors', () => {
    mockI18nExists.mockReturnValue(false)
    const { result } = renderHook(() => useFieldErrors())
    result.current.handleGraphQLError({
      graphQLErrors: [graphQlError],
      message: 'Bad user input',
    })

    expect(global.mockOpenToast).toHaveBeenCalledTimes(2)
    expect(global.mockOpenToast).toHaveBeenCalledWith(
      'Title may not be blank. Title is too short.',
      HoliToastType.ERROR
    )
    expect(global.mockOpenToast).toHaveBeenCalledWith('Description is too long.', HoliToastType.ERROR)
  })

  it('does not display toasts if all field errors are handled', () => {
    mockI18nExists.mockReturnValue(false)
    const { result } = renderHook(() => useFieldErrors({ handledFieldErrors: ['title', 'description'] }))
    result.current.handleGraphQLError({
      graphQLErrors: [graphQlError],
      message: 'Bad user input',
    })

    expect(global.mockOpenToast).not.toHaveBeenCalled()
  })

  it('displays toast for generic error if no field errors could be extracted', () => {
    const { result } = renderHook(() => useFieldErrors())
    const fieldErrors = result.current.handleGraphQLError({
      graphQLErrors: [],
      message: 'Internal server error',
    })

    expect(fieldErrors).toEqual({})
    expect(global.mockOpenToast).toHaveBeenCalledTimes(1)
    expect(global.mockOpenToast).toHaveBeenCalledWith('global.technicalError', HoliToastType.ERROR)
  })
})
