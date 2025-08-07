import { renderHook, waitFor } from '@testing-library/react-native'
import { useCommittedVolunteering } from '@holi/core/screens/userprofile/hooks/useCommittedVolunteering'

jest.mock('@holi/api/graphql/graphql-codegen', () => ({
  VolunteeringOpportunityStatusValue: {
    ToDo: 'TO_DO',
    Contacted: 'CONTACTED',
    Doing: 'DOING',
  },
  useCommittedVolunteeringOpportunitiesQuery: jest.fn(),
}))

const mockDisplayError = jest.fn()

jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: () => ({
    displayError: mockDisplayError,
  }),
}))

jest.mock('@holi/core/helpers/isSSR', () => ({
  isSSR: false,
}))

jest.mock('@holi/core/typesense/hooks/useTypesenseEnrichedData', () => ({
  useTypesenseEnrichedData: jest.fn(),
}))

const { useCommittedVolunteeringOpportunitiesQuery } = require('@holi/api/graphql/graphql-codegen')
const { useTypesenseEnrichedData } = require('@holi/core/typesense/hooks/useTypesenseEnrichedData')

const mockNormalizedItems = [
  {
    id: 'volunteering_ext-1',
    title: 'Help at Food Bank',
    organizerName: 'Local Food Bank',
    imageUrl: '',
    location: '',
    locationType: '',
    status: 'TO_DO',
    externalVolunteeringOpportunityId: 'ext-1',
  },
  {
    id: 'volunteering_ext-2',
    title: 'Beach Cleanup',
    organizerName: 'Ocean Conservation',
    imageUrl: '',
    location: '',
    locationType: '',
    status: 'CONTACTED',
    externalVolunteeringOpportunityId: 'ext-2',
  },
]

const mockGraphQLQuery = {
  data: {
    committedVolunteeringOpportunities: {
      data: [
        { status: 'TO_DO', externalVolunteeringOpportunityId: 'ext-1' },
        { status: 'CONTACTED', externalVolunteeringOpportunityId: 'ext-2' },
      ],
      totalResults: 2,
    },
  },
  loading: false,
  error: undefined,
  refetch: jest.fn(),
  fetchMore: jest.fn(),
}

describe('useCommittedVolunteering', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockDisplayError.mockClear()
    useCommittedVolunteeringOpportunitiesQuery.mockReturnValue(mockGraphQLQuery)
    useTypesenseEnrichedData.mockReturnValue({
      items: mockNormalizedItems,
      totalResults: 2,
      isLoading: false,
      isFetchingMore: false,
      hasMore: false,
      fetchMore: jest.fn(),
      refetch: jest.fn(),
      error: undefined,
      rawGraphQLData: [
        { status: 'TO_DO', externalVolunteeringOpportunityId: 'ext-1' },
        { status: 'CONTACTED', externalVolunteeringOpportunityId: 'ext-2' },
      ],
    })
  })

  it('should return initial state correctly', async () => {
    const { result } = renderHook(() => useCommittedVolunteering())

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
      expect(result.current.isInitialLoad).toBe(false)
      expect(result.current.canFetchMore).toBe(false)
      expect(result.current.totalResults).toBe(2)
      expect(result.current.items).toHaveLength(2)
      expect(result.current.items[0]).toEqual(mockNormalizedItems[0])
    })
  })

  it('should handle initial loading state', () => {
    useTypesenseEnrichedData.mockReturnValue({
      items: [],
      totalResults: 0,
      isLoading: true,
      isFetchingMore: false,
      hasMore: false,
      fetchMore: jest.fn(),
      refetch: jest.fn(),
      error: undefined,
      rawGraphQLData: [],
    })

    const { result } = renderHook(() => useCommittedVolunteering())
    expect(result.current.isLoading).toBe(true)
    expect(result.current.isInitialLoad).toBe(true)
  })

  it('should handle pagination correctly', async () => {
    const mockUtilFetchMore = jest.fn()
    useTypesenseEnrichedData.mockReturnValue({
      items: [mockNormalizedItems[0]],
      totalResults: 2,
      isLoading: false,
      isFetchingMore: false,
      hasMore: true,
      fetchMore: mockUtilFetchMore,
      refetch: jest.fn(),
      error: undefined,
      rawGraphQLData: [{ status: 'TO_DO', externalVolunteeringOpportunityId: 'ext-1' }],
    })

    const { result } = renderHook(() => useCommittedVolunteering(1))
    await waitFor(() => {
      expect(result.current.canFetchMore).toBe(true)
    })
    await result.current.fetchMore()
    expect(mockUtilFetchMore).toHaveBeenCalled()
  })

  it('should handle fetchMore errors with displayError', async () => {
    mockDisplayError.mockClear()

    const mockUtilFetchMore = jest.fn().mockRejectedValue(new Error('Fetch error'))
    useTypesenseEnrichedData.mockReturnValue({
      items: [mockNormalizedItems[0]],
      totalResults: 2,
      isLoading: false,
      isFetchingMore: false,
      hasMore: true,
      fetchMore: mockUtilFetchMore,
      refetch: jest.fn(),
      error: undefined,
      rawGraphQLData: [{ status: 'TO_DO', externalVolunteeringOpportunityId: 'ext-1' }],
    })

    const { result } = renderHook(() => useCommittedVolunteering())

    await result.current.fetchMore()

    expect(mockDisplayError).toHaveBeenCalledWith(
      new Error('Fetch error'),
      'Failed to load your volunteering opportunities',
      { location: 'useCommittedVolunteering.fetchMore' }
    )
  })

  it('should handle refetch errors with displayError', async () => {
    mockDisplayError.mockClear()

    const mockUtilRefetch = jest.fn().mockRejectedValue(new Error('Refetch error'))
    useTypesenseEnrichedData.mockReturnValue({
      items: mockNormalizedItems,
      totalResults: 2,
      isLoading: false,
      isFetchingMore: false,
      hasMore: false,
      fetchMore: jest.fn(),
      refetch: mockUtilRefetch,
      error: undefined,
      rawGraphQLData: [
        { status: 'TO_DO', externalVolunteeringOpportunityId: 'ext-1' },
        { status: 'CONTACTED', externalVolunteeringOpportunityId: 'ext-2' },
      ],
    })

    const { result } = renderHook(() => useCommittedVolunteering())
    await result.current.refetch()

    expect(mockDisplayError).toHaveBeenCalledWith(
      new Error('Refetch error'),
      'Failed to refetch volunteering opportunities',
      { location: 'useCommittedVolunteering.refetch' }
    )
  })

  it('should handle graphql errors', () => {
    const graphqlError = new Error('graphQl error')
    useTypesenseEnrichedData.mockReturnValue({
      items: [],
      totalResults: 0,
      isLoading: false,
      isFetchingMore: false,
      hasMore: false,
      fetchMore: jest.fn(),
      refetch: jest.fn(),
      error: graphqlError,
      rawGraphQLData: [],
    })

    const { result } = renderHook(() => useCommittedVolunteering())
    expect(result.current.items).toEqual([])
    expect(result.current.totalResults).toBe(0)
  })
})
