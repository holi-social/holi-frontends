import { emptyFilters, fullFilters } from '@holi-apps/volunteering/__tests__/testData'
import { useFilterFacetCounts } from '@holi-apps/volunteering/hooks/useFilterFacetCounts'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import {
  type TypesensePaginationState,
  useTypesensePaginationMultiQuery,
} from '@holi/core/typesense/hooks/useTypesensePaginationMultiQuery'
import { renderHook } from '@testing-library/react-native'

const mockUseTypesensePaginationMultiQuery = jest.mocked(useTypesensePaginationMultiQuery)
jest.mock('@holi/core/typesense/hooks/useTypesensePaginationMultiQuery', () => ({
  useTypesensePaginationMultiQuery: jest.fn(),
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
  const facetCounts: TypesensePaginationState['facetCounts'][] = [
    {
      topics_v2: {
        'migration-refugees': 1,
      },
    },
    {
      skills_v2: {
        fundraising: 2,
      },
    },
    {
      commitment_label: {
        recurring: 3,
      },
    },
    {
      commitment_duration: {
        DAYS_1: 4,
      },
    },
  ]
  const searchResults = {
    isLoading: false,
    states: facetCounts.map((result) => ({
      hits: [],
      canFetchMore: true,
      totalResults: 123,
      totalNrOfPages: 13,
      currentPage: 1,
      parameters: {},
      facetCounts: result,
    })),
    isFetchingMore: false,
    fetchNextPages: jest.fn(),
    refetch: jest.fn(),
  }

  beforeEach(() => {
    mockUseTypesensePaginationMultiQuery.mockReturnValue(searchResults)
    mockUseErrorHandling.mockReturnValue({
      displayError: jest.fn(),
    })
  })

  it('should expose loading flag while loading resluts', () => {
    mockUseTypesensePaginationMultiQuery.mockReturnValue({
      ...searchResults,
      isLoading: true,
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

    expect(useTypesensePaginationMultiQuery).toHaveBeenCalledWith({
      parameterList: expect.any(Array),
      skip: true,
      onError: expect.any(Function),
    })
  })

  it('should expose merged facet counts', () => {
    const expectedFacetCounts = {
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

    const { result } = renderHook(() => useFilterFacetCounts({ filters: fullFilters }))

    expect(result.current.isLoading).toBeFalsy()
    expect(result.current.facetCounts).toEqual(expectedFacetCounts)
  })

  it('should refetch facet counts on refresh', () => {
    const refetch = jest.fn()
    mockUseTypesensePaginationMultiQuery.mockReturnValue({
      ...searchResults,
      refetch,
    })

    renderHook(() => useFilterFacetCounts({ filters: fullFilters }))

    expect(mockUseOnRefresh).toHaveBeenCalledWith(refetch)
  })

  it('should display error if fetching results fails', () => {
    const testError = new Error('Search error')
    const displayError = jest.fn()
    mockUseErrorHandling.mockReturnValue({ displayError })
    mockUseTypesensePaginationMultiQuery.mockImplementation(({ onError }) => {
      onError?.(testError)
      return searchResults
    })

    renderHook(() => useFilterFacetCounts({ filters: fullFilters }))

    expect(displayError).toHaveBeenCalledWith(testError, 'Error retrieving filter facet counts', {
      location: 'useFilterFacetCounts.useTypesensePaginationQuery',
    })
  })

  it('should create correct parameters with full filters', () => {
    const expectedParameterList = [
      {
        filter_by:
          'type:=[volunteering,task]&&skills_v2:=[food-service,finances-taxes,fundraising]&&commitment_label:=[recurring]&&commitment_duration:=[DAYS_1]&&location_lat_lng:(1,2,30 km)&&(location_type:=[onsite,hybrid] || (location_type:=[remote] && location:!=[Bundesweit,Germany-wide] && location:!=""))',
        facet_by: 'topics_v2',
        per_page: 0,
        max_facet_values: 29,
      },
      {
        filter_by:
          'type:=[volunteering,task]&&topics_v2:=[migration-refugees,mobility-transport]&&commitment_label:=[recurring]&&commitment_duration:=[DAYS_1]&&location_lat_lng:(1,2,30 km)&&(location_type:=[onsite,hybrid] || (location_type:=[remote] && location:!=[Bundesweit,Germany-wide] && location:!=""))',
        facet_by: 'skills_v2',
        per_page: 0,
        max_facet_values: 29,
      },
      {
        filter_by:
          'type:=[volunteering,task]&&topics_v2:=[migration-refugees,mobility-transport]&&skills_v2:=[food-service,finances-taxes,fundraising]&&commitment_duration:=[DAYS_1]&&location_lat_lng:(1,2,30 km)&&(location_type:=[onsite,hybrid] || (location_type:=[remote] && location:!=[Bundesweit,Germany-wide] && location:!=""))',
        facet_by: 'commitment_label',
        per_page: 0,
        max_facet_values: 29,
      },
      {
        filter_by:
          'type:=[volunteering,task]&&topics_v2:=[migration-refugees,mobility-transport]&&skills_v2:=[food-service,finances-taxes,fundraising]&&commitment_label:=[recurring]&&location_lat_lng:(1,2,30 km)&&(location_type:=[onsite,hybrid] || (location_type:=[remote] && location:!=[Bundesweit,Germany-wide] && location:!=""))',
        facet_by: 'commitment_duration',
        per_page: 0,
        max_facet_values: 29,
      },
    ]

    renderHook(() => useFilterFacetCounts({ filters: fullFilters }))

    expect(useTypesensePaginationMultiQuery).toHaveBeenCalledWith({
      parameterList: expectedParameterList,
      skip: false,
      onError: expect.any(Function),
    })
  })

  it('should create correct parameters with empty filters', () => {
    const expectedParameterList = [
      {
        filter_by: 'type:=[volunteering,task]',
        facet_by: 'topics_v2',
        per_page: 0,
        max_facet_values: 29,
      },
      {
        filter_by: 'type:=[volunteering,task]',
        facet_by: 'skills_v2',
        per_page: 0,
        max_facet_values: 29,
      },
      {
        filter_by: 'type:=[volunteering,task]',
        facet_by: 'commitment_label',
        per_page: 0,
        max_facet_values: 29,
      },
      {
        filter_by: 'type:=[volunteering,task]',
        facet_by: 'commitment_duration',
        per_page: 0,
        max_facet_values: 29,
      },
    ]

    renderHook(() => useFilterFacetCounts({ filters: emptyFilters }))

    expect(useTypesensePaginationMultiQuery).toHaveBeenCalledWith({
      parameterList: expectedParameterList,
      skip: false,
      onError: expect.any(Function),
    })
  })
})
