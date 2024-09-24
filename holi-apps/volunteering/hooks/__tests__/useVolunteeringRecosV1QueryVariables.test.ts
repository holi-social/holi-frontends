import { renderHook } from '@testing-library/react-native'

import { useVolunteeringRecosQueryVariables } from '@holi-apps/volunteering/hooks/useVolunteeringRecosQueryVariables'

const mockUseQuery = jest.fn()
jest.mock('@apollo/client', () => ({
  useQuery: () => mockUseQuery(),
}))

const mockUseLoggedInUser = jest.fn()
jest.mock('@holi/core/screens/userprofile/useLoggedInUser', () => ({
  useLoggedInUser: () => mockUseLoggedInUser(),
}))

const topics = [
  { id: '1', title: 'Topic 1', slug: 'topic-1', isDiscoverSpacesDefault: true },
  { id: '2', title: 'Topic 2', slug: 'topic-2', isDiscoverSpacesDefault: true },
  { id: '3', title: 'Topic 3', slug: 'topic-3', isDiscoverSpacesDefault: true },
  { id: '4', title: 'Topic 4', slug: 'topic-4', isDiscoverSpacesDefault: false },
]
const expectedDefaultTopics = ['topic-1', 'topic-2', 'topic-3']

describe('useVolunteeringRecosQueryVariables', () => {
  beforeEach(() => {
    mockUseQuery.mockReturnValue({
      loading: false,
      data: {
        topics: {
          data: topics,
        },
      },
    })
    mockUseLoggedInUser.mockReturnValue({})
  })

  it('should use default topics if user is not logged in', () => {
    const { result } = renderHook(() => useVolunteeringRecosQueryVariables())

    expect(result.current.queryVariables).toEqual({ topics: expectedDefaultTopics })
  })

  it('should expose loading flag of default topics if user is not logged in', () => {
    mockUseQuery.mockReturnValue({
      loading: true,
    })
    const { result } = renderHook(() => useVolunteeringRecosQueryVariables())

    expect(result.current.loading).toBeTruthy()
  })

  it('should expose loading flag if user is logged in but still loading', () => {
    mockUseLoggedInUser.mockReturnValue({ isLoggedIn: true })
    const { result } = renderHook(() => useVolunteeringRecosQueryVariables())

    expect(result.current.loading).toBeTruthy()
  })

  it('should use topics, skills and location of logged in user', () => {
    mockUseLoggedInUser.mockReturnValue({
      isLoggedIn: true,
      user: {
        interests: [{ slug: 'topic-3' }, { slug: 'topic-4' }],
        skills: [{ slug: 'skill-1' }],
        geolocationId: 'locationId',
      },
    })
    const { result } = renderHook(() => useVolunteeringRecosQueryVariables())

    expect(result.current.queryVariables).toEqual({
      topics: ['topic-3', 'topic-4'],
      skills: ['skill-1'],
      geolocationId: 'locationId',
    })
  })

  it('should use default topics and user location if logged in user has not selected topics or skills', () => {
    mockUseLoggedInUser.mockReturnValue({ isLoggedIn: true, user: { geolocationId: 'locationId' } })
    const { result } = renderHook(() => useVolunteeringRecosQueryVariables())

    expect(result.current.queryVariables).toEqual({
      topics: expectedDefaultTopics,
      geolocationId: 'locationId',
    })
  })
})
