import { render, renderHook } from '@testing-library/react-native'
import type { SearchResponseHit } from '@holi/core/typesense/types'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { logError } from '@holi/core/errors/helpers'
import { useVolunteeringSimilarRecosV2 } from '@holi-apps/volunteering/hooks/useVolunteeringSimilarRecosV2'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'

const mockUseTypesensePaginationQuery = jest.mocked(useTypesensePaginationQuery)
jest.mock('@holi/core/typesense/hooks/useTypesensePaginationQuery', () => ({
  useTypesensePaginationQuery: jest.fn(),
}))

const mockLogError = jest.mocked(logError)
jest.mock('@holi/core/errors/helpers', () => ({
  logError: jest.fn(),
}))

const mockUseOnRefresh = jest.mocked(useOnRefresh)
jest.mock('@holi/core/refreshing/hooks/useOnRefresh', () => ({
  useOnRefresh: jest.fn(),
}))

const mockUseUserLanguage = jest.mocked(useUserLanguage)
jest.mock('@holi/core/screens/search/hooks/useUserLanguage', () => ({
  useUserLanguage: jest.fn(),
}))

const createEngagementHits = (length: number): SearchResponseHit[] =>
  Array.from(
    { length },
    (_, i) =>
      ({
        document: {
          id: i.toString(),
          type: 'volunteering',
          title_de: `Titel ${i}`,
          description_de: '',
          external_url: `https://example.com/engagement${i}`,
          source: 'Aktion Mensch',
        },
      }) as SearchResponseHit
  )

describe('useVolunteeringSimilarRecosV2', () => {
  const documentId = 'volunteering_123'
  const pageSize = 4
  const emptyState = {
    hits: [],
    totalResults: 0,
    totalNrOfPages: 0,
    canFetchMore: false,
    currentPage: 1,
    parameters: {},
    facetCounts: {},
  }

  beforeEach(() => {
    mockUseUserLanguage.mockReturnValue('de')
  })

  it('should query recommendations with correct parameters', () => {
    mockUseTypesensePaginationQuery.mockReturnValue({
      isLoading: false,
      isFetchingMore: false,
      state: emptyState,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
    })

    renderHook(() => useVolunteeringSimilarRecosV2({ documentId, pageSize }))

    expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
      parameters: {
        filter_by: 'type:=[volunteering,task]',
        sort_by: '_vector_distance:asc',
        per_page: 4,
        vector_query: 'similarity_embedding:([],id:volunteering_123)',
      },
      onError: expect.any(Function),
    })
  })

  it('logs error if fetching recos fails', () => {
    const testError = new Error('Test')
    mockUseTypesensePaginationQuery.mockImplementation(({ onError }) => {
      onError?.(testError)
      return {
        isLoading: false,
        isFetchingMore: false,
        state: emptyState,
        refetch: jest.fn(),
        fetchNextPage: jest.fn(),
      }
    })

    renderHook(() => useVolunteeringSimilarRecosV2({ documentId, pageSize }))

    expect(mockLogError).toHaveBeenCalledWith(testError, 'Error retrieving similar recommendations', {
      location: 'VolunteeringSimilarRecos.useTypesensePaginationQuery',
    })
  })

  it('should return empty list if there are no recommendations', () => {
    mockUseTypesensePaginationQuery.mockReturnValue({
      isLoading: false,
      isFetchingMore: false,
      state: emptyState,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
    })

    const { result } = renderHook(() => useVolunteeringSimilarRecosV2({ documentId, pageSize }))

    expect(result.current).toHaveLength(0)
  })

  it('should return localized recommendations', () => {
    mockUseTypesensePaginationQuery.mockReturnValue({
      isFetchingMore: false,
      isLoading: false,
      state: {
        hits: createEngagementHits(4),
        totalResults: 5,
        totalNrOfPages: 1,
        canFetchMore: false,
        currentPage: 1,
        parameters: {},
        facetCounts: {},
      },
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
    })

    const { result } = renderHook(() => useVolunteeringSimilarRecosV2({ documentId, pageSize }))

    expect(result.current).toHaveLength(4)
    expect(result.current[0]).toEqual({
      description: '',
      external_url: 'https://example.com/engagement0',
      id: '0',
      locationCountry: '',
      organizerLocationCountry: '',
      source: 'Aktion Mensch',
      summary: '',
      title: 'Titel 0',
      type: 'volunteering',
    })
  })

  it('should register fetching recos on pull-to-refresh', () => {
    const refetch = jest.fn()
    mockUseTypesensePaginationQuery.mockReturnValue({
      refetch,
      isLoading: false,
      isFetchingMore: false,
      state: emptyState,
      fetchNextPage: jest.fn(),
    })

    renderHook(() => useVolunteeringSimilarRecosV2({ documentId, pageSize }))

    expect(mockUseOnRefresh).toHaveBeenCalledWith(refetch)
  })
})
