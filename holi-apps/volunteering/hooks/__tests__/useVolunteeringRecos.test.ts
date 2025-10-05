import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { useVolunteeringRecoParameters } from '@holi-apps/volunteering/hooks/useVolunteeringRecoParameters'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import type { SearchParams, SearchResponseHit } from '@holi/core/typesense/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { renderHook } from 'expo-router/testing-library'
import { useVolunteeringRecos } from '@holi-apps/volunteering/hooks/useVolunteeringRecos'
import { logError } from '@holi/core/errors/helpers'

const mockUseVolunteeringRecoParameters = jest.mocked(useVolunteeringRecoParameters)
jest.mock('@holi-apps/volunteering/hooks/useVolunteeringRecoParameters', () => ({
  useVolunteeringRecoParameters: jest.fn(),
}))

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

describe('useVolunteeringRecos', () => {
  const parameters: SearchParams = {
    filter_by: '',
    sort_by: '',
    vector_query: '',
    exclude_fields: '',
    per_page: 10,
  }
  const results = {
    hits: createHits(10),
    totalResults: 123,
    totalNrOfPages: 13,
    canFetchMore: true,
    currentPage: 1,
    parameters,
    facetCounts: {},
  }

  beforeEach(() => {
    jest.useFakeTimers()
    mockUseVolunteeringRecoParameters.mockReturnValue({
      isLoadingParameters: false,
      parameters,
    })
    mockUseTypesensePaginationQuery.mockReturnValue({
      isLoading: false,
      state: results,
      isFetchingMore: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })
    mockUseErrorHandling.mockReturnValue({
      displayError: jest.fn(),
    })
  })

  afterEach(async () => {
    jest.useRealTimers()
  })

  it('should expose loading flag while loading parameters', () => {
    mockUseVolunteeringRecoParameters.mockReturnValue({
      isLoadingParameters: true,
      parameters: {},
    })
    mockUseTypesensePaginationQuery.mockReturnValue({
      isLoading: false,
      state: {
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
    })

    const { result } = renderHook(() => useVolunteeringRecos())

    expect(result.current.isLoading).toBeTruthy()
  })

  it('should skip query execution while loading parameters', () => {
    mockUseVolunteeringRecoParameters.mockReturnValue({
      isLoadingParameters: true,
      parameters: {},
    })

    renderHook(() => useVolunteeringRecos())

    expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
      parameters: {},
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

    const { result } = renderHook(() => useVolunteeringRecos())

    expect(result.current.isLoading).toBeTruthy()
  })

  it('should query results with the correct parameters', () => {
    renderHook(() => useVolunteeringRecos())

    expect(mockUseVolunteeringRecoParameters).toHaveBeenCalledWith({
      pageSize: 10,
      onGeolocationError: expect.any(Function),
    })
    expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
      parameters,
      skip: false,
      onError: expect.any(Function),
    })
  })

  it('should use given page size', () => {
    renderHook(() => useVolunteeringRecos({ pageSize: 5 }))

    expect(mockUseVolunteeringRecoParameters).toHaveBeenCalledWith({
      pageSize: 5,
      onGeolocationError: expect.any(Function),
    })
  })

  it('should expose transformed search results', () => {
    const { result } = renderHook(() => useVolunteeringRecos())

    expect(result.current.isLoading).toBeFalsy()
    const engagements = result.current.engagements
    expect(engagements).toHaveLength(10)
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

    const { result } = renderHook(() => useVolunteeringRecos())

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

    const { result } = renderHook(() => useVolunteeringRecos())

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

    const { result } = renderHook(() => useVolunteeringRecos())

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

    renderHook(() => useVolunteeringRecos())

    expect(mockUseOnRefresh).toHaveBeenCalledWith(refetch)
  })

  it('should display error if fetching geolocation fails and errors should be displayed', () => {
    const testError = new Error('Geolocation error')
    const displayError = jest.fn()
    mockUseErrorHandling.mockReturnValue({ displayError })
    mockUseVolunteeringRecoParameters.mockImplementation((props) => {
      props?.onGeolocationError?.(testError)
      return {
        isLoadingParameters: false,
        parameters: {},
      }
    })

    renderHook(() => useVolunteeringRecos({ displayErrors: true }))

    expect(displayError).toHaveBeenCalledWith(testError, 'Error retrieving geolocation', {
      location: 'useVolunteeringRecos.useVolunteeringRecoParameters',
    })
  })

  it('should display error if fetching results fails and errors should be displayed', () => {
    const testError = new Error('Search error')
    const displayError = jest.fn()
    mockUseErrorHandling.mockReturnValue({ displayError })
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

    renderHook(() => useVolunteeringRecos({ displayErrors: true }))

    expect(displayError).toHaveBeenCalledWith(testError, 'Error retrieving recommendations', {
      location: 'useVolunteeringRecos.useTypesensePaginationQuery',
    })
  })

  it('should log error if fetching geolocation fails and errors should not be displayed', () => {
    const testError = new Error('Geolocation error')
    const displayError = jest.fn()
    mockUseErrorHandling.mockReturnValue({ displayError })
    mockUseVolunteeringRecoParameters.mockImplementation((props) => {
      props?.onGeolocationError?.(testError)
      return {
        isLoadingParameters: false,
        parameters: {},
      }
    })

    renderHook(() => useVolunteeringRecos())

    expect(mockLogError).toHaveBeenCalledWith(testError, 'Error retrieving geolocation', {
      location: 'useVolunteeringRecos.useVolunteeringRecoParameters',
    })
    expect(displayError).not.toHaveBeenCalled()
  })

  it('should log error if fetching results fails and errors should not be displayed', () => {
    const testError = new Error('Search error')
    const displayError = jest.fn()
    mockUseErrorHandling.mockReturnValue({ displayError })
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

    renderHook(() => useVolunteeringRecos())

    expect(mockLogError).toHaveBeenCalledWith(testError, 'Error retrieving recommendations', {
      location: 'useVolunteeringRecos.useTypesensePaginationQuery',
    })
    expect(displayError).not.toHaveBeenCalled()
  })
})
