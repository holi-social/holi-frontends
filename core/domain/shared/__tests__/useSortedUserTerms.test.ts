import { AccountType } from '@holi/api/graphql/graphql-codegen'
import { type LoggedInState, useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useSortedUserTerms } from '@holi/core/domain/shared/useSortedUserTerms'
import { renderHook } from 'expo-router/testing-library'

const mockUseLoggedInUser = jest.mocked(useLoggedInUser)
jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: jest.fn(),
}))

describe('useSortedUserTerms', () => {
  beforeEach(() => {
    const mockedUser: LoggedInState = {
      state: 'loggedIn',
      isLoading: false,
      isLoggedIn: true,
      isLoggedOut: false,
      user: {
        isEmployee: false,
        id: '',
        email: '',
        identity: '',
        avatarDefaultColor: '',
        avatarLabel: '',
        fullName: '',
        interestsV2: ['gender-equality', 'disaster-relief'],
        skillsV2: ['legal-assistance', 'other', 'driving'],
        isOidc: false,
        accountType: AccountType.Email,
      },
    }
    mockUseLoggedInUser.mockReturnValue(mockedUser)
  })

  describe('for topics', () => {
    it('should only contain user interests', () => {
      const { result } = renderHook(() => useSortedUserTerms('topic'))

      expect(result.current).toHaveLength(2)
    })

    it('should maintain topic sorting', () => {
      const expectedOrder = ['disaster-relief', 'gender-equality']
      const { result } = renderHook(() => useSortedUserTerms('topic'))

      expect(result.current).toEqual(expectedOrder)
    })
  })

  describe('for skills', () => {
    it('should only contain user skills', () => {
      const { result } = renderHook(() => useSortedUserTerms('skill'))

      expect(result.current).toHaveLength(3)
    })

    it('should maintain skill sorting', () => {
      const expectedOrder = ['driving', 'legal-assistance', 'other']
      const { result } = renderHook(() => useSortedUserTerms('skill'))

      expect(result.current).toEqual(expectedOrder)
    })
  })
})
