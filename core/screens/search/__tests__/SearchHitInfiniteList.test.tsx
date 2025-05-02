import React from 'react'
import { act, fireEvent, render, screen, userEvent } from '@testing-library/react-native'
import type { SearchFilter, SearchResults } from '@holi/core/screens/search/types'
import { SearchHitInfiniteList } from '@holi/core/screens/search/SearchHitInfiniteList'
import type { TrackingEvent } from '@holi/core/tracking'
import {
  hit4,
  profileHit,
  spaceHit,
  toSearchResponseHit,
  volunteeringHit,
} from '@holi/core/screens/search/__tests__/testData'
import { useSearchResults } from '@holi/core/screens/search/hooks/useSearchResults'
import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import { createSearchParameters } from '@holi/core/screens/search/helpers/createSearchParameters'

const mockUseSearchResults = jest.mocked(useSearchResults)
jest.mock('@holi/core/screens/search/hooks/useSearchResults', () => ({
  useSearchResults: jest.fn(),
}))

const removeDeniedProps = (hits: SearchResponseHit<TypesenseDocument>[]) =>
  hits.map((original) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { link_locators, image_url, ...document } = original.document
    return document
  })

describe('SearchHitInfiniteList', () => {
  const hits: SearchResponseHit<TypesenseDocument>[] = [volunteeringHit, profileHit, spaceHit].map(toSearchResponseHit)
  const filter: SearchFilter = {
    facet: 'volunteering',
    query: 'search terms',
  }
  const emptyFilter: SearchFilter = {
    facet: 'volunteering',
    query: '',
  }
  const searchResults: SearchResults = {
    isLoading: false,
    hits,
    totalResults: 4,
    totalNrOfPages: 2,
    currentPage: 1,
    canFetchMore: true,
    parameters: createSearchParameters(filter),
  }
  const emptySearchResults: SearchResults = {
    isLoading: false,
    hits: [],
    totalResults: 0,
    totalNrOfPages: 0,
    currentPage: 1,
    canFetchMore: false,
    parameters: createSearchParameters(filter),
  }

  beforeEach(() => {
    jest.useFakeTimers()
    mockUseSearchResults.mockReturnValue({
      searchResults,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })
  })

  afterEach(() => {
    act(jest.runOnlyPendingTimers)
    jest.useRealTimers()
  })

  it('tracks searchResultsRendered event', async () => {
    render(<SearchHitInfiniteList filter={filter} onQuerySelect={jest.fn()} />)

    // simulate time has passed so that debounced tracking function is called
    await jest.runAllTimersAsync()

    expect(mockTrack).toHaveBeenCalledWith({
      name: 'searchResultsRendered',
      event_version__major: 1,
      event_version__minor: 0,
      event_version__patch: 0,
      properties: {
        query: 'search terms',
        totalNrOfResults: 4,
        totalNrOfPages: 2,
        currentPage: 1,
        renderedResults: removeDeniedProps(hits),
        selectedFacets: ['volunteering'],
      },
    } as TrackingEvent)
  })

  it('should render search results', () => {
    render(<SearchHitInfiniteList filter={filter} onQuerySelect={jest.fn()} />)

    expect(screen.getAllByTestId(/search-hit/)).toHaveLength(3)
  })

  it('should render loader when results are empty and loading', async () => {
    mockUseSearchResults.mockReturnValue({
      searchResults: {
        ...emptySearchResults,
        isLoading: true,
      },
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })

    render(<SearchHitInfiniteList filter={filter} onQuerySelect={jest.fn()} />)

    expect(screen.getByTestId('loader')).toBeOnTheScreen()
    expect(await screen.queryByTestId('nextPageLoader')).not.toBeOnTheScreen()
  })

  it('should render loader when results are empty and loading parameters', async () => {
    mockUseSearchResults.mockReturnValue({
      searchResults: emptySearchResults,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })

    render(<SearchHitInfiniteList filter={filter} onQuerySelect={jest.fn()} loadingParameters />)

    expect(screen.getByTestId('loader')).toBeOnTheScreen()
    expect(await screen.queryByTestId('nextPageLoader')).not.toBeOnTheScreen()
  })

  it('should render search examples when results and filter are empty', async () => {
    mockUseSearchResults.mockReturnValue({
      searchResults: { ...emptySearchResults },
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })

    render(<SearchHitInfiniteList filter={emptyFilter} onQuerySelect={jest.fn()} />)

    expect(screen.getByTestId('search-examples')).toBeOnTheScreen()
  })

  it('should display text for empty search results', async () => {
    mockUseSearchResults.mockReturnValue({
      searchResults: emptySearchResults,
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })
    render(<SearchHitInfiniteList filter={filter} onQuerySelect={jest.fn()} />)

    expect(screen.getByText('search.typesense.noResults.headline')).toBeOnTheScreen()
    expect(await screen.queryByTestId('nextPageLoader')).not.toBeOnTheScreen()
  })

  it('should render loader in footer if more pages can be loaded', () => {
    render(<SearchHitInfiniteList filter={filter} onQuerySelect={jest.fn()} />)

    expect(screen.getByTestId('nextPageLoader')).toBeOnTheScreen()
  })

  it('should not render loader in footer if all pages were loaded', async () => {
    mockUseSearchResults.mockReturnValue({
      searchResults: {
        ...searchResults,
        isLoading: true,
        canFetchMore: false,
      },
      fetchNextPage: jest.fn(),
      refetch: jest.fn(),
    })
  })

  it('tracks searchResultPressed event', async () => {
    const user = userEvent.setup()
    render(<SearchHitInfiniteList filter={filter} onQuerySelect={jest.fn()} />)

    // simulate time has passed so that debounced tracking function is called
    await jest.runAllTimersAsync()

    mockTrack.mockReset() // we're not interested in the searchResultsRendered event

    // press second item
    await user.press(screen.getAllByLabelText(profileHit.user_full_name!)[0]) // eslint-disable-line @typescript-eslint/no-non-null-assertion

    expect(mockTrack).toHaveBeenCalledWith({
      name: 'searchResultPressed',
      event_version__major: 1,
      event_version__minor: 0,
      event_version__patch: 0,
      properties: {
        itemPressed: removeDeniedProps([hits[1]])[0],
        itemPressedIndex: 1,
        itemPressedType: profileHit.type,
        itemPressedTitleDe: profileHit.user_full_name,
        itemPressedTitleEn: profileHit.user_full_name,
        query: 'search terms',
        totalNrOfResults: 4,
        totalNrOfPages: 2,
        currentPage: 1,
        renderedResults: removeDeniedProps(hits),
        selectedFacets: ['volunteering'],
      },
    } as TrackingEvent)
  })

  it('fetches more data on scroll and fires another searchResultsRendered tracking event', async () => {
    const page1 = hits
    const page2 = [toSearchResponseHit(hit4)]
    const fetchNextPage = jest.fn()

    // Mock more hits to be returned when scrolling
    mockUseSearchResults.mockReturnValueOnce({
      searchResults,
      fetchNextPage,
      refetch: jest.fn(),
    })
    mockUseSearchResults.mockReturnValue({
      searchResults: {
        ...searchResults,
        currentPage: 2,
        hits: [...page1, ...page2],
      },
      fetchNextPage,
      refetch: jest.fn(),
    })

    const { rerender } = render(<SearchHitInfiniteList filter={filter} onQuerySelect={jest.fn()} />)

    // simulate time has passed so that debounced tracking function is called
    await jest.runAllTimersAsync()

    // Trigger onEndReached by scrolling to the bottom
    const flatList = screen.getByTestId('search-results-list')
    fireEvent(flatList, 'onEndReached') // Triggers fetchNextPage to fetch new items

    // Check if `fetchNextPage` was called to fetch additional data
    expect(fetchNextPage).toHaveBeenCalled()

    rerender(<SearchHitInfiniteList filter={filter} onQuerySelect={jest.fn()} />)

    // simulate time has passed so that debounced tracking function is called
    await jest.runAllTimersAsync()

    // Check if another tracking event was fired after fetching new data
    expect(mockTrack).toHaveBeenCalledTimes(2)
    expect(mockTrack).toHaveBeenLastCalledWith({
      name: 'searchResultsRendered',
      event_version__major: 1,
      event_version__minor: 0,
      event_version__patch: 0,
      properties: {
        query: 'search terms',
        totalNrOfResults: 4,
        totalNrOfPages: 2,
        currentPage: 2,
        renderedResults: removeDeniedProps([...page1, ...page2]), // Adjust for newly fetched results if needed
        selectedFacets: ['volunteering'],
      },
    })
  })

  it('should refetch on pull-to-refresh', () => {
    const refetch = jest.fn()
    mockUseSearchResults.mockReturnValueOnce({
      searchResults,
      fetchNextPage: jest.fn(),
      refetch,
    })

    render(<SearchHitInfiniteList filter={filter} onQuerySelect={jest.fn()} />)

    // Trigger pull-to-refresh
    const flatList = screen.getByTestId('search-results-list')
    fireEvent(flatList, 'onRefresh')

    expect(refetch).toHaveBeenCalled()
  })
})
