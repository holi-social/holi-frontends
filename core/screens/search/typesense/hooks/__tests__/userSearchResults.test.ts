import { useErrorHandling } from '@holi/core/errors/hooks'
import { createSearchParameters } from '@holi/core/screens/search/typesense/helpers/createSearchParameters'
import { useSearchResults } from '@holi/core/screens/search/typesense/hooks/useSearchResults'
import type { SearchHitData } from '@holi/core/screens/search/typesense/types'
import { act, renderHook } from '@testing-library/react-native'
import type { SearchResponseHit, SearchParams } from 'typesense/lib/Typesense/Documents'

jest.useFakeTimers()

const mockSearch = jest.fn()
jest.mock('@holi/core/screens/search/typesense/helpers/createTypesenseClient', () => ({
  createTypesenseClient: () => ({
    search: (parameters: SearchParams) => mockSearch(parameters),
  }),
}))
const mockUseErrorHandling = jest.mocked(useErrorHandling)
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

const createSearchHit = (id: number): Partial<SearchResponseHit<SearchHitData>> => ({
  document: {
    id: id.toString(),
    type: 'volunteering',
  },
})

const createSearchHits = (count: number) => Array.from({ length: count }, (_, index) => createSearchHit(index + 1))

describe('useSearchResults', () => {
  const filter = {
    query: 'nachhilfe',
    facet: 'volunteering',
  }
  const hits = createSearchHits(10)

  beforeEach(() => {
    mockUseErrorHandling.mockReturnValue({
      displayError: jest.fn(),
    })
    mockSearch.mockResolvedValue({ found: hits.length, page: 1, hits })
  })

  it('should expose the loading state and results', async () => {
    const { result } = renderHook(() => useSearchResults(filter))

    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.searchResults.hits).toEqual([])

    await act(async () => {
      await jest.runAllTimersAsync()
    })

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.searchResults.hits).toEqual(hits)
  })

  it('should perform search with the correct parameters', async () => {
    renderHook(() => useSearchResults(filter))

    await act(async () => {
      await jest.runAllTimersAsync()
    })

    expect(mockSearch).toHaveBeenCalledWith(createSearchParameters(filter, 1))
  })

  it('should expose the search pagination info', async () => {
    const { result } = renderHook(() => useSearchResults(filter))

    await act(async () => {
      await jest.runAllTimersAsync()
    })

    expect(result.current.searchResults).toEqual({
      hits,
      totalNrOfResults: 10,
      totalNrOfPages: 1,
      currentPage: 1,
      canLoadMore: false,
      filter,
    })
  })

  it('should append results and update searchResultInfo when loading more', async () => {
    const allHits = createSearchHits(13)
    mockSearch.mockResolvedValueOnce({ found: 13, page: 1, hits: allHits.slice(0, 10) })
    mockSearch.mockResolvedValue({ found: 13, page: 2, hits: allHits.slice(10, 13) })
    const { result } = renderHook(() => useSearchResults(filter))

    await act(async () => {
      await jest.runAllTimersAsync()
    })

    expect(mockSearch).toHaveBeenCalledWith(createSearchParameters(filter, 1))
    expect(result.current.searchResults).toEqual({
      hits,
      totalNrOfResults: 13,
      totalNrOfPages: 2,
      currentPage: 1,
      canLoadMore: true,
      filter,
    })

    await act(async () => {
      result.current.loadMore()
      await jest.runAllTimersAsync()
    })

    expect(mockSearch).toHaveBeenCalledWith(createSearchParameters(filter, 2))
    expect(result.current.searchResults).toEqual({
      hits: allHits,
      totalNrOfResults: 13,
      totalNrOfPages: 2,
      currentPage: 2,
      canLoadMore: false,
      filter,
    })
  })

  it('should load again from the first page and replace results when refresh is called', async () => {
    // First request: 3 results, second request: 10 results
    mockSearch.mockResolvedValueOnce({ found: 3, page: 1, hits: createSearchHits(3) })
    mockSearch.mockResolvedValueOnce({ found: 10, page: 1, hits })
    const { result } = renderHook(() => useSearchResults(filter))

    await act(async () => {
      await jest.runAllTimersAsync()
    })

    expect(result.current.searchResults.hits).toHaveLength(3)

    await act(async () => {
      result.current.refresh()
      await jest.runAllTimersAsync()
    })

    expect(result.current.searchResults.hits).toHaveLength(10)
    expect(mockSearch).toHaveBeenCalledTimes(2)
    expect(mockSearch.mock.calls).toEqual([[createSearchParameters(filter, 1)], [createSearchParameters(filter, 1)]])
  })

  it('should refresh search on filter change', async () => {
    const newFilter = {
      query: 'new query',
      facet: 'volunteering',
    }
    const { result, rerender } = renderHook((props) => useSearchResults(props), { initialProps: filter })

    await act(async () => {
      await jest.runAllTimersAsync()
    })

    expect(result.current.searchResults.filter).toEqual(filter)
    expect(mockSearch).toHaveBeenCalledWith(createSearchParameters(filter, 1))

    rerender(newFilter)

    await act(async () => {
      await jest.runAllTimersAsync()
    })

    expect(mockSearch).toHaveBeenCalledWith(createSearchParameters(newFilter, 1))
    expect(result.current.searchResults.filter).toEqual(newFilter)
  })

  it('should not perform search if already loading for same filter', async () => {
    const { result, rerender } = renderHook((props) => useSearchResults(props), { initialProps: filter })

    expect(result.current.isLoading).toBeTruthy()
    expect(mockSearch).toHaveBeenCalledWith(createSearchParameters(filter, 1))

    rerender({ ...filter })

    await act(async () => {
      await jest.runAllTimersAsync()
    })

    expect(mockSearch).toHaveBeenCalledTimes(1)
  })

  it('should ignore results of first search if not matching the current filter', async () => {
    const newFilter = {
      query: 'new query',
      facet: 'volunteering',
    }
    const { result, rerender } = renderHook((props) => useSearchResults(props), { initialProps: filter })

    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.searchResults.filter).toEqual(filter)
    expect(mockSearch).toHaveBeenCalledWith(createSearchParameters(filter, 1))

    rerender(newFilter)

    await act(async () => {
      await jest.runAllTimersAsync()
    })

    expect(mockSearch).toHaveBeenCalledTimes(2)
    expect(mockSearch).toHaveBeenCalledWith(createSearchParameters(newFilter, 1))
  })

  it('should display error when search fails', async () => {
    const error = new Error('Search failed')
    mockSearch.mockRejectedValueOnce(error)
    const displayError = jest.fn()
    mockUseErrorHandling.mockReturnValue({ displayError })

    const { result } = renderHook(() => useSearchResults(filter))

    await act(async () => {
      await jest.runAllTimersAsync()
    })

    expect(result.current.isLoading).toBeFalsy()
    expect(mockUseErrorHandling().displayError).toHaveBeenCalledWith(
      error,
      'Error retrieving search results',
      expect.objectContaining({
        location: 'useSearchResults.performSearch',
      })
    )
  })
})
