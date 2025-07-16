import { useErrorHandling } from '@holi/core/errors/hooks'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { renderHook } from '@testing-library/react-native'
import { fullFilters } from '@holi-apps/volunteering/__tests__/testData'
import { useFilterFacetCounts } from '@holi-apps/volunteering/hooks/useFilterFacetCounts'

const mockUseTypesensePaginationQuery = jest.mocked(useTypesensePaginationQuery)
jest.mock('@holi/core/typesense/hooks/useTypesensePaginationQuery', () => ({
  useTypesensePaginationQuery: jest.fn(),
}))

const mockUseOnRefresh = jest.mocked(useOnRefresh)
jest.mock('@holi/core/refreshing/hooks/useOnRefresh', () => ({
  useOnRefresh: jest.fn(),
}))

const mockUseErrorHandling = jest.mocked(useErrorHandling)
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

describe('useFilterFacetCounts', () => {
  const facetCounts = {
    topics_v2: {
      'migration-refugees': 1,
    },
    skills_v2: {
      fundraising: 2,
    },
    commitment_label: {
      recurring: 3,
    },
    commitment_duration: {
      DAYS_1: 4,
    },
  }
  const searchResult = {
    state: {
      isLoading: false,
      hits: [],
      canFetchMore: true,
      totalResults: 123,
      totalNrOfPages: 13,
      currentPage: 1,
      parameters: {},
      facetCounts,
    },
    isFetchingMore: false,
    fetchNextPage: jest.fn(),
    refetch: jest.fn(),
  }

  beforeEach(() => {
    mockUseTypesensePaginationQuery.mockReturnValue(searchResult)
    mockUseErrorHandling.mockReturnValue({
      displayError: jest.fn(),
    })
  })

  it('should expose loading flag while loading resluts', () => {
    mockUseTypesensePaginationQuery.mockReturnValue({
      ...searchResult,
      state: {
        ...searchResult.state,
        isLoading: true,
      },
    })

    const { result } = renderHook(() => useFilterFacetCounts({ filters: fullFilters, loadingFilters: true }))

    expect(result.current.isLoading).toBeTruthy()
  })

  it('should pass on loading state of filters', () => {
    const { result } = renderHook(() => useFilterFacetCounts({ filters: fullFilters, loadingFilters: true }))

    expect(result.current.isLoading).toBeTruthy()
  })

  it('should skip query execution while loading parameters', () => {
    renderHook(() => useFilterFacetCounts({ filters: fullFilters, loadingFilters: true }))

    expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
      parameters: {
        filter_by:
          'type:=[volunteering,task]&&skills_v2:=[food-service,finances-taxes,fundraising]&&commitment_label:=[recurring]&&commitment_duration:=[DAYS_1]&&location_lat_lng:(1,2,30 km)',
        facet_by: 'topics_v2',
        per_page: 0,
        max_facet_values: 29,
      },
      skip: true,
      onError: expect.any(Function),
    })
  })

  it('should expose facets', () => {
    const { result } = renderHook(() => useFilterFacetCounts({ filters: fullFilters }))

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.facetCounts).toEqual(facetCounts)
  })

  it('should refetch facet counts on refresh', () => {
    const refetch = jest.fn()
    mockUseTypesensePaginationQuery.mockReturnValue({
      ...searchResult,
      refetch,
    })

    renderHook(() => useFilterFacetCounts({ filters: fullFilters }))

    expect(mockUseOnRefresh).toHaveBeenCalledWith(refetch)
  })

  it('should display error if fetching results fails', () => {
    const testError = new Error('Search error')
    const displayError = jest.fn()
    mockUseErrorHandling.mockReturnValue({ displayError })
    mockUseTypesensePaginationQuery.mockImplementation(({ onError }) => {
      onError?.(testError)
      return {
        state: {
          isLoading: false,
          hits: [],
          totalResults: 0,
          totalNrOfPages: 0,
          canFetchMore: false,
          currentPage: 1,
          parameters: {},
          facetCounts: {},
        },
        isFetchingMore: false,
        fetchNextPage: jest.fn(),
        refetch: jest.fn(),
      }
    })

    renderHook(() => useFilterFacetCounts({ filters: fullFilters }))

    expect(displayError).toHaveBeenCalledWith(testError, 'Error retrieving filter facet counts', {
      location: 'useFilterFacetCounts.useTypesensePaginationQuery',
    })
  })

  it('should create correct parameters when filtering by all filters', () => {
    renderHook(() => useFilterFacetCounts({ filters: fullFilters }))

    expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
      parameters: {
        filter_by:
          'type:=[volunteering,task]&&skills_v2:=[food-service,finances-taxes,fundraising]&&commitment_label:=[recurring]&&commitment_duration:=[DAYS_1]&&location_lat_lng:(1,2,30 km)',
        facet_by: 'topics_v2',
        per_page: 0,
        max_facet_values: 29,
      },
      skip: false,
      onError: expect.any(Function),
    })
  })
})
