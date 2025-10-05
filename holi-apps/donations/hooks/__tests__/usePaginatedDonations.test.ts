import { createLocalizedDonations, createTypesenseDonations } from '@holi-apps/donations/components/__tests__/testData'
import { usePaginatedDonations } from '@holi-apps/donations/hooks/usePaginatedDonations'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { renderHook } from 'expo-router/testing-library'

const mockUseTypesensePaginationQuery = jest.mocked(useTypesensePaginationQuery)
jest.mock('@holi/core/typesense/hooks/useTypesensePaginationQuery', () => ({
  useTypesensePaginationQuery: jest.fn(),
}))

const mockUseOnRefresh = jest.mocked(useOnRefresh)
jest.mock('@holi/core/refreshing/hooks/useOnRefresh', () => ({
  useOnRefresh: jest.fn(),
}))

const mockUseUserLanguage = jest.mocked(useUserLanguage)
jest.mock('@holi/core/screens/search/hooks/useUserLanguage', () => ({
  useUserLanguage: jest.fn(),
}))

const pageSize = 10
const searchResultState = {
  hits: createTypesenseDonations(10).map((document) => ({
    document,
    highlight: {},
  })),
  totalNrOfPages: 13,
  totalResults: 123,
  canFetchMore: false,
  currentPage: 1,
  parameters: {},
  facetCounts: {},
}
const selectedLocation: GeolocationSuggestion = {
  id: '123',
  label: 'Hamburg, Germany',
  coordinates: {
    latitude: 12,
    longitude: 34,
  },
}

describe('useDonationDetails', () => {
  beforeEach(() => {
    mockUseTypesensePaginationQuery.mockReturnValue({
      isLoading: false,
      isFetchingMore: false,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
      state: searchResultState,
    })
    mockUseUserLanguage.mockReturnValue('en')
  })

  it('should query projects with correct parameters', () => {
    const onError = jest.fn()
    renderHook(() => usePaginatedDonations({ pageSize, onError }))

    expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
      parameters: {
        filter_by: 'type:=[donation]',
        per_page: 10,
        sort_by: '',
      },
      onError,
    })
  })

  it('should query projects with location filter', () => {
    const onError = jest.fn()
    renderHook(() => usePaginatedDonations({ pageSize, selectedLocation, onError }))

    expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
      parameters: {
        filter_by: 'type:=[donation]&&location_lat_lng:(12,34,30 km)',
        per_page: 10,
        sort_by: 'location_lat_lng(12,34,precision:5km):asc',
      },
      onError,
    })
  })

  it('should return loading state', () => {
    mockUseTypesensePaginationQuery.mockReturnValue({
      isLoading: true,
      isFetchingMore: false,
      refetch: jest.fn(),
      fetchNextPage: jest.fn(),
      state: searchResultState,
    })

    const { result } = renderHook(() => usePaginatedDonations({ pageSize }))

    expect(result.current.isLoading).toBeTruthy()
  })

  it('should return callback and flags for fetching more projects', () => {
    const fetchNextPage = jest.fn()
    mockUseTypesensePaginationQuery.mockReturnValue({
      isLoading: false,
      isFetchingMore: true,
      refetch: jest.fn(),
      fetchNextPage,
      state: { ...searchResultState, canFetchMore: true },
    })

    const { result } = renderHook(() => usePaginatedDonations({ pageSize }))

    expect(result.current.canFetchMore).toBeTruthy()
    expect(result.current.isFetchingMore).toBeTruthy()

    result.current.fetchNextPage()

    expect(fetchNextPage).toHaveBeenCalled()
  })

  it('should return loading state and skip query if geolocation is loading', () => {
    const { result } = renderHook(() => usePaginatedDonations({ pageSize, loadingGeolocation: true }))

    expect(result.current.isLoading).toBeTruthy()

    expect(useTypesensePaginationQuery).toHaveBeenCalledWith({
      parameters: {
        filter_by: 'type:=[donation]',
        per_page: 10,
        sort_by: '',
      },
      skip: true,
    })
  })

  it('should return transformed projects', () => {
    const expectedProjects = createLocalizedDonations(10, 'en')

    const { result } = renderHook(() => usePaginatedDonations({ pageSize }))

    expect(result.current.projects).toEqual(expectedProjects)
  })

  it('should register refresh function', () => {
    const refetch = jest.fn()
    mockUseTypesensePaginationQuery.mockReturnValue({
      isLoading: false,
      isFetchingMore: false,
      refetch,
      fetchNextPage: jest.fn(),
      state: searchResultState,
    })

    renderHook(() => usePaginatedDonations({ pageSize }))

    expect(mockUseOnRefresh).toHaveBeenCalledWith(refetch)
  })
})
