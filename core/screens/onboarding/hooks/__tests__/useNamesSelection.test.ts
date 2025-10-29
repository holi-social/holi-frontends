import type { User } from '@holi/core/domain/shared/types'
import { act, renderHook } from '@testing-library/react-hooks'
import type { GraphQLError } from 'graphql'
import { HoliToastType } from '@holi/ui/components/molecules/HoliToastProvider'
import { type NamesSelectionData, useNamesSelection } from '@holi/core/screens/onboarding/hooks/useNamesSelection'
import { CombinedGraphQLErrors } from '@apollo/client'

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    i18n: {
      exists: () => true,
    },
    t: (key: string) => key,
  }),
}))

const createBackendError = (error: unknown) => {
  const graphQlError: GraphQLError = {
    extensions: {
      errors: JSON.stringify(error),
    },
    locations: undefined,
    path: undefined,
    nodes: undefined,
    source: undefined,
    positions: undefined,
    originalError: undefined,
    toJSON: jest.fn(),
    [Symbol.toStringTag]: '',
    name: '',
    message: 'Bad user input',
  }
  return new CombinedGraphQLErrors({
    errors: [graphQlError],
  })
}

describe('useNamesSelection', () => {
  const user = {} as User
  const emptyNames = { firstName: '', lastName: '', pronouns: '' }

  it('should intialize state with existing user names', () => {
    const userWithNames = { firstName: 'Ada', lastName: 'Lovelace', pronouns: 'she/her' } as User

    const { result } = renderHook(() => useNamesSelection({ user: userWithNames }))

    expect(result.current.names).toEqual(userWithNames)
  })

  it('should initialize with empty names if user has no name', () => {
    const { result } = renderHook(() => useNamesSelection({ user }))

    expect(result.current.names).toEqual(emptyNames)
  })

  const fields: (keyof NamesSelectionData)[] = ['firstName', 'lastName', 'pronouns']
  it.each(fields)('should update state on change of field %s', (field) => {
    const expectedNames = {
      ...emptyNames,
      [field]: 'Update',
    }
    const { result } = renderHook(() => useNamesSelection({ user }))

    act(() => result.current.onNamesChange(field, 'Update'))

    expect(result.current.names).toEqual(expectedNames)
  })

  it('should validate first name', () => {
    const { result } = renderHook(() => useNamesSelection({ user }))

    expect(result.current.nameStepIsValid).toBeFalsy()
  })

  it('should validate last name', () => {
    const userWithInvalidLastName = { firstName: 'Ada', lastName: 'L'.repeat(200) } as User
    const { result } = renderHook(() => useNamesSelection({ user: userWithInvalidLastName }))

    expect(result.current.nameStepIsValid).toBeFalsy()
  })

  it('should validate first name on blur', () => {
    const { result } = renderHook(() => useNamesSelection({ user }))

    act(() => {
      result.current.scrollToNamesInputWithId('firstName').onBlur()
    })

    expect(result.current.namesFieldErrors).toEqual({
      firstName: ['registration.accountSetup.names.validation.firstName.minCharacters'],
    })
  })

  it('should validate last name on blur', () => {
    const userWithInvalidLastName = { ...user, lastName: 'L'.repeat(200) }
    const { result } = renderHook(() => useNamesSelection({ user: userWithInvalidLastName }))

    act(() => {
      result.current.scrollToNamesInputWithId('lastName').onBlur()
    })

    expect(result.current.namesFieldErrors).toMatchObject({
      lastName: ['registration.accountSetup.names.validation.lastName.maxCharacters'],
    })
  })

  it('should handle backend errors', () => {
    const backendError = createBackendError({
      firstName: [{ code: 'blank', message: 'First name may not be blank.' }],
    })

    const { result } = renderHook(() => useNamesSelection({ user }))

    act(() => {
      result.current.handleBackendError(backendError)
    })

    expect(result.current.namesFieldErrors).toEqual({
      firstName: ['registration.accountSetup.names.validation.firstName.blank'],
    })
  })

  it('should display toast for backend errors not handled by input fields', () => {
    const backendError = createBackendError({
      interests: [{ code: 'maxLength', message: 'Too many interests' }],
    })

    const { result } = renderHook(() => useNamesSelection({ user }))

    act(() => {
      result.current.handleBackendError(backendError)
    })

    expect(global.mockOpenToast).toHaveBeenCalledWith(
      'registration.accountSetup.names.validation.interests.maxLength',
      HoliToastType.ERROR
    )
  })
})
