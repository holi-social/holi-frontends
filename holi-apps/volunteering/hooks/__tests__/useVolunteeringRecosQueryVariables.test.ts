import { renderHook } from '@testing-library/react-native'

import {
  type LoggedInUser,
  loggedInUserLoading,
  loggedOut,
  useLoggedInUser,
} from '@holi/core/auth/hooks/useLoggedInUser'
import { ALL_SKILLS, ALL_TOPICS, type AuthenticatedUser } from '@holi/core/domain/shared/types'
import { getRandomAuthenticatedUser } from '@holi/ui/helper/fakeUsers'

import { useVolunteeringRecosQueryVariables } from '@holi-apps/volunteering/hooks/useVolunteeringRecosQueryVariables'

jest.mock('@holi/core/auth/hooks/useLoggedInUser')
const mockUseLoggedInUser = jest.mocked(useLoggedInUser)

const loggedInUser = (user: AuthenticatedUser): LoggedInUser => ({
  state: 'loggedIn',
  isLoading: false,
  isLoggedIn: true,
  isLoggedOut: false,
  user,
})

describe('useVolunteeringRecosQueryVariables', () => {
  beforeEach(() => {
    mockUseLoggedInUser.mockReturnValue(loggedInUserLoading)
  })

  it('should use default topics if user is not logged in', () => {
    mockUseLoggedInUser.mockReturnValue(loggedOut)
    const { result } = renderHook(() => useVolunteeringRecosQueryVariables())

    expect(result.current.queryVariables).toEqual({ topics: undefined })
  })

  it('should expose loading flag if user is logged in but still loading', () => {
    mockUseLoggedInUser.mockReturnValue(loggedInUserLoading)
    const { result } = renderHook(() => useVolunteeringRecosQueryVariables())

    expect(result.current.loading).toBeTruthy()
  })

  it('should use topics, skills and location of logged in user', () => {
    const topics = [ALL_TOPICS[2], ALL_TOPICS[3]]
    const skills = [ALL_SKILLS[0]]
    mockUseLoggedInUser.mockReturnValue(
      loggedInUser({
        ...getRandomAuthenticatedUser(),
        interestsV2: topics,
        skillsV2: skills,
        geolocationId: 'locationId',
      })
    )
    const { result } = renderHook(() => useVolunteeringRecosQueryVariables())

    expect(result.current.queryVariables).toEqual({
      topics,
      skills,
      geolocationId: 'locationId',
    })
  })

  it('should use default topics and user location if logged in user has not selected topics or skills', () => {
    mockUseLoggedInUser.mockReturnValue(
      loggedInUser({
        ...getRandomAuthenticatedUser(),
        geolocationId: 'locationId',
      })
    )
    const { result } = renderHook(() => useVolunteeringRecosQueryVariables())

    expect(result.current.queryVariables).toEqual({
      topics: undefined,
      geolocationId: 'locationId',
    })
  })
})
