import React from 'react'
import { VolunteeringTypesenseRecommendations } from '@holi-apps/volunteering/components/VolunteeringTypesenseRecommendations'
import { render, screen, userEvent } from '@testing-library/react-native'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { useVolunteeringRecoTypesenseParameters } from '@holi-apps/volunteering/hooks/useVolunteeringRecoTypesenseParameters'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import type { SearchParams, SearchResponseHit } from 'typesense/lib/Typesense/Documents'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import { useRecosSubtitle } from '@holi/core/hooks/useRecosSubtitle'
import { TrackingEvent } from '@holi/core/tracking'
import { useErrorHandling } from '@holi/core/errors/hooks'

const mockUseVolunteeringRecoTypesenseParameters = jest.mocked(useVolunteeringRecoTypesenseParameters)
jest.mock('@holi-apps/volunteering/hooks/useVolunteeringRecoTypesenseParameters', () => ({
  useVolunteeringRecoTypesenseParameters: jest.fn(),
}))

const mockUseTypesensePaginationQuery = jest.mocked(useTypesensePaginationQuery)
jest.mock('@holi/core/typesense/hooks/useTypesensePaginationQuery', () => ({
  useTypesensePaginationQuery: jest.fn(),
}))

const mockUseRecosSubtitle = jest.mocked(useRecosSubtitle)
jest.mock('@holi/core/hooks/useRecosSubtitle', () => ({
  useRecosSubtitle: jest.fn(),
}))

const mockUseOnRefresh = jest.mocked(useOnRefresh)
jest.mock('@holi/core/refreshing/hooks/useOnRefresh', () => ({
  useOnRefresh: jest.fn(),
}))

const mockUseErrorHandling = jest.mocked(useErrorHandling)
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

const createHits = (length: number): SearchResponseHit<TypesenseDocument>[] =>
  Array.from(
    { length },
    (_, i) =>
      ({
        document: {
          id: i.toString(),
          type: 'volunteering',
          title_de: `Titel ${i}`,
        },
      }) as SearchResponseHit<TypesenseDocument>
  )

describe('VolunteeringTypesenseRecommendations', () => {
  const parameters: SearchParams = {
    filter_by: '',
    sort_by: '',
    vector_query: '',
    exclude_fields: '',
    per_page: 10,
  }
  const results = {
    isLoading: false,
    data: createHits(10),
    totalResults: 123,
    canFetchMore: true,
    currentPage: 1,
    parameters,
  }

  beforeEach(() => {
    jest.useFakeTimers()
    mockUseVolunteeringRecoTypesenseParameters.mockReturnValue({
      isLoadingParameters: false,
      parameters,
    })
    mockUseTypesensePaginationQuery.mockReturnValue({
      state: results,
      isFetchingMore: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })
    mockUseRecosSubtitle.mockReturnValue('Recos subtitle')
    mockUseErrorHandling.mockReturnValue({
      displayError: jest.fn(),
    })
  })

  afterEach(async () => {
    jest.useRealTimers()
  })

  it('should render skeleton while loading parameters', () => {
    mockUseVolunteeringRecoTypesenseParameters.mockReturnValue({
      isLoadingParameters: true,
      parameters: {},
    })
    mockUseTypesensePaginationQuery.mockReturnValue({
      state: {
        isLoading: false,
        data: [],
        totalResults: 0,
        canFetchMore: false,
        currentPage: 1,
        parameters: {},
      },
      isFetchingMore: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })

    render(<VolunteeringTypesenseRecommendations />)

    expect(screen.getByTestId('volunteering-list-skeleton')).toBeOnTheScreen()
  })

  it('should skip query execution while loading parameters', () => {
    mockUseVolunteeringRecoTypesenseParameters.mockReturnValue({
      isLoadingParameters: true,
      parameters: {},
    })

    render(<VolunteeringTypesenseRecommendations />)

    expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
      parameters: {},
      skip: true,
      onError: expect.any(Function),
    })
  })

  it('should render skeleton while loading results', () => {
    mockUseTypesensePaginationQuery.mockReturnValue({
      state: {
        isLoading: true,
        data: [],
        totalResults: 0,
        canFetchMore: false,
        currentPage: 1,
        parameters,
      },
      isFetchingMore: false,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })

    render(<VolunteeringTypesenseRecommendations />)

    expect(screen.getByTestId('volunteering-list-skeleton')).toBeOnTheScreen()
  })

  it('should query results with the correct parameters', () => {
    render(<VolunteeringTypesenseRecommendations />)

    expect(mockUseVolunteeringRecoTypesenseParameters).toHaveBeenCalledWith({
      pageSize: 10,
      onGeolocationError: expect.any(Function),
    })
    expect(mockUseTypesensePaginationQuery).toHaveBeenCalledWith({
      parameters,
      skip: false,
      onError: expect.any(Function),
    })
  })

  it('should render search results', () => {
    render(<VolunteeringTypesenseRecommendations />)

    // Header
    expect(screen.getByText('discoveryV1.headline')).toBeOnTheScreen()
    expect(screen.getByText('listing.subline')).toBeOnTheScreen()
    expect(screen.getByText('Recos subtitle')).toBeOnTheScreen()

    // Results
    expect(screen.getAllByRole('link')).toHaveLength(10)
    results.data.forEach((result) => {
      expect(screen.getByText(result.document.title_de!)).toBeOnTheScreen()
    })
  })

  it('should load more results on scroll', () => {
    const fetchNextPage = jest.fn()
    mockUseTypesensePaginationQuery.mockReturnValue({
      state: results,
      isFetchingMore: false,
      fetchNextPage,
      refetch: jest.fn(),
    })

    render(<VolunteeringTypesenseRecommendations />)

    expect(screen.getByTestId('volunteering-loader')).toBeOnTheScreen()
    expect(fetchNextPage).toHaveBeenCalled()
  })

  it('should not load more results if nothing more can be fetched', () => {
    const fetchNextPage = jest.fn()
    mockUseTypesensePaginationQuery.mockReturnValue({
      state: {
        isLoading: false,
        data: createHits(3),
        totalResults: 3,
        canFetchMore: false,
        currentPage: 1,
        parameters,
      },
      isFetchingMore: false,
      fetchNextPage,
      refetch: jest.fn(),
    })

    render(<VolunteeringTypesenseRecommendations />)

    expect(screen.queryByTestId('volunteering-loader')).not.toBeOnTheScreen()
    expect(fetchNextPage).not.toHaveBeenCalled()
  })

  it('should link to detail pages', async () => {
    const user = userEvent.setup()

    render(<VolunteeringTypesenseRecommendations />)

    await user.press(screen.getByText('Titel 0'))

    expect(mockNavigate).toHaveBeenCalledWith('//volunteering/0')
  })

  it('should track pressing cards', async () => {
    const user = userEvent.setup()

    render(<VolunteeringTypesenseRecommendations />)

    await user.press(screen.getByText('Titel 0'))

    expect(mockTrack).toHaveBeenCalledWith(TrackingEvent.RecommendationPressed('volunteering_opportunity', '0', 0))
  })

  it('should refetch results on refresh', () => {
    const refetch = jest.fn()
    mockUseTypesensePaginationQuery.mockReturnValue({
      state: results,
      isFetchingMore: false,
      fetchNextPage: jest.fn(),
      refetch,
    })

    render(<VolunteeringTypesenseRecommendations />)

    expect(mockUseOnRefresh).toHaveBeenCalledWith(refetch)
  })

  it('should display error if fetching geolocation fails', () => {
    const testError = new Error('Geolocation error')
    const displayError = jest.fn()
    mockUseErrorHandling.mockReturnValue({ displayError })
    mockUseVolunteeringRecoTypesenseParameters.mockImplementation((props) => {
      props?.onGeolocationError?.(testError)
      return {
        isLoadingParameters: false,
        parameters: {},
      }
    })

    render(<VolunteeringTypesenseRecommendations />)

    expect(displayError).toHaveBeenCalledWith(testError, 'Error retrieving geolocation', {
      location: 'VolunteeringTypesenseRecommendations.useVolunteeringRecoTypesenseParameters',
    })
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
          data: [],
          totalResults: 0,
          canFetchMore: false,
          currentPage: 1,
          parameters,
        },
        isFetchingMore: false,
        fetchNextPage: jest.fn(),
        refetch: jest.fn(),
      }
    })

    render(<VolunteeringTypesenseRecommendations />)

    expect(displayError).toHaveBeenCalledWith(testError, 'Error retrieving recommendations', {
      location: 'VolunteeringTypesenseRecommendations.useTypesensePaginationQuery',
    })
  })
})
