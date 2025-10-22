import { useErrorHandling } from '@holi/core/errors/hooks'
import { createSearchParameters } from '@holi/core/screens/search/helpers/createSearchParameters'
import { useSearchResults } from '@holi/core/screens/search/hooks/useSearchResults'
import type { SearchFilter } from '@holi/core/screens/search/types'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { type SearchResponseHit, TypesenseDocumentType } from '@holi/core/typesense/types'
import { renderHook } from 'expo-router/testing-library'

const mockUseTypesensePaginationQuery = jest.mocked(useTypesensePaginationQuery)
jest.mock('@holi/core/typesense/hooks/useTypesensePaginationQuery', () => ({
  useTypesensePaginationQuery: jest.fn(),
}))

const mockUseErrorHandling = jest.mocked(useErrorHandling)
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

const createSearchHit = (id: number): SearchResponseHit => ({
  document: {
    id: id.toString(),
    type: TypesenseDocumentType.Volunteering,
  },
  highlight: {},
  text_match: 0,
})

const createSearchHits = (count: number) => Array.from({ length: count }, (_, index) => createSearchHit(index + 1))

describe('useSearchResults', () => {
  const filter: SearchFilter = {
    query: 'nachhilfe',
    facet: 'volunteering',
  }
  const parameters = createSearchParameters(filter)
  const hits = createSearchHits(10)
  const state = {
    hits,
    totalNrOfPages: 0,
    totalResults: 0,
    canFetchMore: false,
    currentPage: 0,
    parameters,
    facetCounts: {},
  }

  beforeEach(() => {
    mockUseErrorHandling.mockReturnValue({
      displayError: jest.fn(),
    })
    mockUseTypesensePaginationQuery.mockReturnValue({
      state,
      isLoading: false,
      isFetchingMore: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })
  })

  it('should perform search with the correct parameters', () => {
    renderHook(() => useSearchResults(filter))

    expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
      parameters,
      skip: false,
      onError: expect.any(Function),
    })
  })

  it('should expose the search pagination info', () => {
    const { result } = renderHook(() => useSearchResults(filter))

    expect(result.current.searchResults).toEqual(state)
  })

  it('should expose function to fetch next page', () => {
    const fetchNextPage = jest.fn()
    mockUseTypesensePaginationQuery.mockReturnValue({
      state,
      isLoading: false,
      isFetchingMore: false,
      fetchNextPage,
      refetch: jest.fn(),
    })

    const { result } = renderHook(() => useSearchResults(filter))

    result.current.fetchNextPage()

    expect(fetchNextPage).toHaveBeenCalled()
  })

  it('should expose function to refetch results', () => {
    const refetch = jest.fn()
    mockUseTypesensePaginationQuery.mockReturnValue({
      state,
      isLoading: false,
      isFetchingMore: false,
      fetchNextPage: jest.fn(),
      refetch,
    })

    const { result } = renderHook(() => useSearchResults(filter))

    result.current.refetch()

    expect(refetch).toHaveBeenCalled()
  })

  it('should display error when search fails', () => {
    const error = new Error('Search failed')
    mockUseTypesensePaginationQuery.mockImplementation(({ onError }) => {
      onError?.(error)
      return {
        state,
        isLoading: false,
        isFetchingMore: false,
        fetchNextPage: jest.fn(),
        refetch: jest.fn(),
      }
    })
    const displayError = jest.fn()
    mockUseErrorHandling.mockReturnValue({ displayError })

    renderHook(() => useSearchResults(filter))

    expect(mockUseErrorHandling().displayError).toHaveBeenCalledWith(
      error,
      'Error retrieving search results',
      expect.objectContaining({
        location: 'useSearchResults.useTypesensePaginationQuery',
      })
    )
  })

  it('should skip request for empty filter', () => {
    const emptyFilter: SearchFilter = {
      query: '',
      facet: 'volunteering',
    }
    const emptyQueryParameters = createSearchParameters(emptyFilter)

    renderHook(() => useSearchResults(emptyFilter))

    expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
      parameters: emptyQueryParameters,
      skip: true,
      onError: expect.any(Function),
    })
  })
})
