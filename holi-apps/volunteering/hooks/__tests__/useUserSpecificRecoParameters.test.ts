import {
  DEFAULT_RECO_TOPICS_V2,
  useUserSpecificRecoParameters,
} from '@holi-apps/volunteering/hooks/useUserSpecificRecoParameters'
import { AccountType } from '@holi/api/graphql/graphql-codegen'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import type { User } from '@holi/core/domain/shared/types'
import { renderHook } from 'expo-router/testing-library'

const mockUseLoggedInUser = jest.mocked(useLoggedInUser)
jest.mock('@holi/core/auth/hooks/useLoggedInUser', () => ({
  useLoggedInUser: jest.fn(),
}))

describe('useUserSpecificRecoParameters', () => {
  const mockUser = (data: Partial<User> = {}) => {
    mockUseLoggedInUser.mockReturnValue({
      user: {
        email: '',
        isEmployee: false,
        isOidc: false,
        id: '',
        identity: '',
        avatarDefaultColor: '',
        avatarLabel: '',
        fullName: '',
        accountType: AccountType.Email,
        ...data,
      },
      state: 'loggedIn',
      isLoading: false,
      isLoggedIn: true,
      isLoggedOut: false,
    })
  }

  it('should return loading flag while user is loading', () => {
    mockUseLoggedInUser.mockReturnValue({
      isLoading: true,
      state: 'loading',
      isLoggedIn: false,
      isLoggedOut: false,
      user: undefined,
    })

    const { result } = renderHook(() => useUserSpecificRecoParameters())

    expect(result.current).toEqual({
      loading: true,
    })
  })

  it('should return user interests, skills and location', () => {
    mockUser({
      interestsV2: ['topic1', 'topic2'],
      skillsV2: ['skill1'],
      geolocationId: 'locationId',
    })

    const { result } = renderHook(() => useUserSpecificRecoParameters())

    expect(result.current).toEqual({
      topics: ['topic1', 'topic2'],
      skills: ['skill1'],
      geolocationId: 'locationId',
    })
  })

  it('should return default topics and user location if user has no interests or skills', () => {
    mockUser({
      geolocationId: 'locationId',
    })

    const { result } = renderHook(() => useUserSpecificRecoParameters())

    expect(result.current).toEqual({
      topics: DEFAULT_RECO_TOPICS_V2,
      geolocationId: 'locationId',
    })
  })

  it('should return default topics if user has no data', () => {
    mockUser()

    const { result } = renderHook(() => useUserSpecificRecoParameters())

    expect(result.current).toEqual({
      topics: DEFAULT_RECO_TOPICS_V2,
    })
  })

  it('should return default topics if user is not logged in', () => {
    mockUseLoggedInUser.mockReturnValue({
      isLoading: false,
      state: 'loggedOut',
      isLoggedIn: false,
      isLoggedOut: true,
      user: undefined,
    })

    const { result } = renderHook(() => useUserSpecificRecoParameters())

    expect(result.current).toEqual({
      topics: DEFAULT_RECO_TOPICS_V2,
    })
  })
})
