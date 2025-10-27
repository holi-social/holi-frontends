import React from 'react'
import { mockParameters } from '@holi/core/navigation/hooks/useParam/__mocks__/mockParameters'
import { useGeolocationDetailsWithSuggestion } from '@holi/core/geolocation/hooks/useGeolocationDetails'
import { useSearchFilter } from '@holi/core/screens/search/hooks/useSearchFilter'
import { renderRouter } from 'expo-router/testing-library'
import { Search } from '@holi/core/screens/search/Search'
import { useSearchResults } from '@holi/core/screens/search/hooks/useSearchResults'
import type { SearchFilter } from '@holi/core/screens/search/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import type { CombinedGraphQLErrors } from '@apollo/client'

jest.mock('@holi/core/navigation/hooks/useParam')

const mockUseErrorHandling = jest.mocked(useErrorHandling)
jest.mock('@holi/core/errors/hooks', () => ({
  useErrorHandling: jest.fn(),
}))

const mockUseGeolocationDetailsWithSuggestion = jest.mocked(useGeolocationDetailsWithSuggestion)
jest.mock('@holi/core/geolocation/hooks/useGeolocationDetails', () => ({
  useGeolocationDetailsWithSuggestion: jest.fn(),
}))

const mockUseSearchFilter = jest.mocked(useSearchFilter)
jest.mock('@holi/core/screens/search/hooks/useSearchFilter', () => ({
  useSearchFilter: jest.fn(),
}))

const mockUseSearchResults = jest.mocked(useSearchResults)
jest.mock('@holi/core/screens/search/hooks/useSearchResults', () => ({
  useSearchResults: jest.fn(),
}))

jest.useFakeTimers()

describe('Search', () => {
  const filter: SearchFilter = {
    query: 'Ada Lovelace',
    facet: 'profile',
  }

  beforeEach(() => {
    mockUseErrorHandling.mockReturnValue({
      displayError: jest.fn(),
    })
    mockUseGeolocationDetailsWithSuggestion.mockReturnValue({ loadingGeolocation: false })
    mockUseSearchFilter.mockReturnValue({
      filter,
      setQuery: jest.fn(),
      setFacet: jest.fn(),
      setLocation: jest.fn(),
    })
    mockUseSearchResults.mockReturnValue({
      isLoading: false,
      searchResults: {
        hits: [],
        totalResults: 0,
        totalNrOfPages: 0,
        currentPage: 0,
        canFetchMore: false,
        parameters: {},
        facetCounts: {},
      },
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })
  })

  it('should prefill filter from query parameters', () => {
    mockParameters({ query: 'some query', facet: 'space' })

    renderRouter({
      index: () => <Search />,
    })

    expect(mockUseSearchFilter).toHaveBeenCalledWith(
      {
        query: 'some query',
        facet: 'space',
      },
      expect.any(Function)
    )
  })

  it('fetches initial geolocation by id from query parameters', () => {
    mockParameters({ location: '123' })

    renderRouter({
      index: () => <Search />,
    })

    expect(mockUseGeolocationDetailsWithSuggestion).toHaveBeenCalledWith('123', expect.any(Function))
  })

  it('displays an error and clears the location parameter when fetching the locaiton failes', () => {
    const { mockUseUpdateParams } = mockParameters({ location: '123' })
    const mockDisplayError = jest.fn()
    mockUseErrorHandling.mockReturnValue({
      displayError: mockDisplayError,
    })
    const error = { message: 'Test error' } as CombinedGraphQLErrors

    renderRouter({
      index: () => <Search />,
    })

    // Trigger onError callback of geolocation hook
    const onError = mockUseGeolocationDetailsWithSuggestion.mock.calls[0][1]
    onError?.(error)

    expect(mockDisplayError).toHaveBeenCalledWith(error, 'Failed to load geolocation', {
      displayMessage: 'search.location.notFound',
      geolocationId: '123',
      location: 'Search.useGeolocationCoordinates',
    })
    expect(mockUseUpdateParams).toHaveBeenCalledWith({ location: undefined })
  })

  it('fetches results with filter created by useSearchFilter', () => {
    mockParameters({})

    renderRouter({
      index: () => <Search />,
    })

    expect(useSearchResults).toHaveBeenCalledWith(filter)
  })
})
