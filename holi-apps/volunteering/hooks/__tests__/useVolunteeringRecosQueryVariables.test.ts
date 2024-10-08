import { renderHook } from '@testing-library/react-native'

import { LoggedInUser, loggedInUserLoading, loggedOut, useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { useDefaultTopics } from '@holi/core/domain/shared/hooks'
import { AuthenticatedUser, Skill, Topic } from '@holi/core/domain/shared/types'
import { getRandomAuthenticatedUser } from '@holi/ui/helper/fakeUsers'

import { useVolunteeringRecosQueryVariables } from '@holi-apps/volunteering/hooks/useVolunteeringRecosQueryVariables'

jest.mock('@holi/core/domain/shared/hooks')
const mockUseDefaultTopics = jest.mocked(useDefaultTopics)

jest.mock('@holi/core/auth/hooks/useLoggedInUser')
const mockUseLoggedInUser = jest.mocked(useLoggedInUser)

const topic1: Topic = { id: '1', title: 'Topic 1', slug: 'topic-1', isDiscoverSpacesDefault: true }
const topic2: Topic = { id: '2', title: 'Topic 2', slug: 'topic-2', isDiscoverSpacesDefault: true }
const topic3: Topic = { id: '3', title: 'Topic 3', slug: 'topic-3', isDiscoverSpacesDefault: true }
const topic4: Topic = { id: '4', title: 'Topic 4', slug: 'topic-4', isDiscoverSpacesDefault: false }

const defaultTopics: Topic[] = [topic1, topic2, topic3]
const expectedDefaultTopicsSlugs: string[] = [topic1.slug, topic2.slug, topic3.slug]

const skill1: Skill = { id: 'skill-1', title: 'Skill 1', slug: 'skill-1' }

const loggedInUser = (user: AuthenticatedUser): LoggedInUser => ({
  state: 'loggedIn',
  isLoading: false,
  isLoggedIn: true,
  isLoggedOut: false,
  user,
})

describe('useVolunteeringRecosQueryVariables', () => {
  beforeEach(() => {
    mockUseDefaultTopics.mockReturnValue({ defaultTopics: defaultTopics, defaultTopicsLoading: false })
    mockUseLoggedInUser.mockReturnValue(loggedInUserLoading)
  })

  it('should use default topics if user is not logged in', () => {
    mockUseLoggedInUser.mockReturnValue(loggedOut)
    const { result } = renderHook(() => useVolunteeringRecosQueryVariables())

    expect(result.current.queryVariables).toEqual({ topics: expectedDefaultTopicsSlugs })
  })

  it('should expose loading flag of default topics if user is not logged in', () => {
    mockUseDefaultTopics.mockReturnValue({ defaultTopics: defaultTopics, defaultTopicsLoading: true })
    const { result } = renderHook(() => useVolunteeringRecosQueryVariables())

    expect(result.current.loading).toBeTruthy()
  })

  it('should expose loading flag if user is logged in but still loading', () => {
    mockUseLoggedInUser.mockReturnValue(loggedInUserLoading)
    const { result } = renderHook(() => useVolunteeringRecosQueryVariables())

    expect(result.current.loading).toBeTruthy()
  })

  it('should use topics, skills and location of logged in user', () => {
    mockUseLoggedInUser.mockReturnValue(
      loggedInUser({
        ...getRandomAuthenticatedUser(),
        interests: [topic3, topic4],
        skills: [skill1],
        geolocationId: 'locationId',
      })
    )
    const { result } = renderHook(() => useVolunteeringRecosQueryVariables())

    expect(result.current.queryVariables).toEqual({
      topics: ['topic-3', 'topic-4'],
      skills: ['skill-1'],
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
      topics: expectedDefaultTopicsSlugs,
      geolocationId: 'locationId',
    })
  })
})
