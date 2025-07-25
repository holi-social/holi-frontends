import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import type { SearchParams, SearchResponseHit } from '@holi/core/typesense/types'
import { renderHook } from '@testing-library/react-native'
import { logError } from '@holi/core/errors/helpers'
import { MICROACTION_PAGE_SIZE, useMicroactions } from '@holi-apps/volunteering/hooks/useMicroactions'
import { useMicroactionParameters } from '@holi-apps/volunteering/hooks/useMicroactionParameters'
import type { PlaceDetails } from '@holi/core/geolocation/typings'

const mockUseMicroactionParameters = jest.mocked(useMicroactionParameters)
jest.mock('@holi-apps/volunteering/hooks/useMicroactionParameters', () => ({
  useMicroactionParameters: jest.fn(),
}))

const mockUseTypesensePaginationQuery = jest.mocked(useTypesensePaginationQuery)
jest.mock('@holi/core/typesense/hooks/useTypesensePaginationQuery', () => ({
  useTypesensePaginationQuery: jest.fn(),
}))

const mockUseOnRefresh = jest.mocked(useOnRefresh)
jest.mock('@holi/core/refreshing/hooks/useOnRefresh', () => ({
  useOnRefresh: jest.fn(),
}))

const mockLogError = jest.mocked(logError)
jest.mock('@holi/core/errors/helpers', () => ({
  logError: jest.fn(),
}))

const createHits = (length: number): SearchResponseHit[] =>
  Array.from(
    { length },
    (_, i) =>
      ({
        document: {
          id: i.toString(),
          type: 'volunteering',
          title_de: `Titel ${i}`,
        },
      }) as SearchResponseHit
  )

const userLocation: PlaceDetails = {
  id: '123',
  name: 'Hamburg, Germany',
  geolocation: {
    properties: {
      lat: 1,
      lon: 2,
      formatted: 'Hamburg, Germany',
    },
    place_id: '123',
    geometry: {
      type: '',
      coordinates: [],
    },
  },
}

describe('useMicroActions', () => {
  const parameters: SearchParams = {
    filter_by: 'type:=[volunteering,task]',
    sort_by: '_rand():desc',
    per_page: MICROACTION_PAGE_SIZE,
  }
  const results = {
    hits: createHits(5),
    totalResults: 123,
    totalNrOfPages: 13,
    canFetchMore: true,
    currentPage: 1,
    parameters,
    facetCounts: {},
  }

  beforeEach(() => {
    jest.useFakeTimers()
    mockUseMicroactionParameters.mockReturnValue({
      parameters,
    })
    mockUseTypesensePaginationQuery.mockReturnValue({
      isLoading: false,
      state: results,
      isFetchingMore: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })
  })

  afterEach(async () => {
    jest.useRealTimers()
  })

  it('should skip query execution when skip flag is set', () => {
    renderHook(() => useMicroactions({ skip: true }))

    expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
      parameters,
      skip: true,
      onError: expect.any(Function),
    })
  })

  it('should expose loading flag while loading results', () => {
    mockUseTypesensePaginationQuery.mockReturnValue({
      isLoading: true,
      state: {
        hits: [],
        totalResults: 0,
        totalNrOfPages: 0,
        canFetchMore: false,
        currentPage: 1,
        parameters,
        facetCounts: {},
      },
      isFetchingMore: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })

    const { result } = renderHook(() => useMicroactions())

    expect(result.current.isLoading).toBeTruthy()
  })

  it('should expose loading flag while fetching more results', () => {
    mockUseTypesensePaginationQuery.mockReturnValue({
      isLoading: true,
      state: results,
      isFetchingMore: true,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })

    const { result } = renderHook(() => useMicroactions())

    expect(result.current.isLoading).toBeTruthy()
  })

  it('should query results with the correct parameters', () => {
    renderHook(() => useMicroactions({ userLocation }))

    expect(mockUseMicroactionParameters).toHaveBeenCalledWith(MICROACTION_PAGE_SIZE, userLocation)
    expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
      parameters,
      skip: false,
      onError: expect.any(Function),
    })
  })

  it('should expose transformed search results', () => {
    const { result } = renderHook(() => useMicroactions())

    expect(result.current.isLoading).toBeFalsy()
    const engagements = result.current.engagements
    expect(engagements).toHaveLength(5)
    for (let i = 0; i < engagements.length; i++) {
      expect(engagements[i]).toMatchObject({
        id: i.toString(),
        title: `Titel ${i}`,
      })
    }
  })

  it('should expose flag if more results can be fetched', () => {
    mockUseTypesensePaginationQuery.mockReturnValue({
      isLoading: false,
      state: results,
      isFetchingMore: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })

    const { result } = renderHook(() => useMicroactions())

    expect(result.current.canFetchMore).toBeTruthy()
  })

  it('should expose flag if nothing more can be fetched', () => {
    const fetchNextPage = jest.fn()
    mockUseTypesensePaginationQuery.mockReturnValue({
      isLoading: false,
      state: {
        hits: createHits(3),
        totalResults: 3,
        totalNrOfPages: 0,
        canFetchMore: false,
        currentPage: 1,
        parameters,
        facetCounts: {},
      },
      isFetchingMore: false,
      fetchNextPage,
      refetch: jest.fn(),
    })

    const { result } = renderHook(() => useMicroactions())

    expect(result.current.canFetchMore).toBeFalsy()
  })

  it('should allow fetching more results', () => {
    const fetchNextPage = jest.fn()
    mockUseTypesensePaginationQuery.mockReturnValue({
      isLoading: false,
      state: results,
      isFetchingMore: false,
      fetchNextPage,
      refetch: jest.fn(),
    })

    const { result } = renderHook(() => useMicroactions())

    result.current.fetchNextPage()

    expect(fetchNextPage).toHaveBeenCalled()
  })

  it('should refetch results on refresh', () => {
    const refetch = jest.fn()
    mockUseTypesensePaginationQuery.mockReturnValue({
      isLoading: false,
      state: results,
      isFetchingMore: false,
      fetchNextPage: jest.fn(),
      refetch,
    })

    renderHook(() => useMicroactions())

    expect(mockUseOnRefresh).toHaveBeenCalledWith(refetch)
  })

  it('should log error if fetching results fails', () => {
    const testError = new Error('Search error')
    const displayError = jest.fn()
    mockUseTypesensePaginationQuery.mockImplementation(({ onError }) => {
      onError?.(testError)
      return {
        isLoading: false,
        state: {
          hits: [],
          totalResults: 0,
          totalNrOfPages: 0,
          canFetchMore: false,
          currentPage: 1,
          parameters,
          facetCounts: {},
        },
        isFetchingMore: false,
        fetchNextPage: jest.fn(),
        refetch: jest.fn(),
      }
    })

    renderHook(() => useMicroactions())

    expect(mockLogError).toHaveBeenCalledWith(testError, 'Error retrieving recommendations', {
      location: 'useMicroactions.useTypesensePaginationQuery',
    })
    expect(displayError).not.toHaveBeenCalled()
  })
})
