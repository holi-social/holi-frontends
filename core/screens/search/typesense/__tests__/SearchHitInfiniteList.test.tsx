import React from 'react'
import { act, fireEvent, render, screen, userEvent } from '@testing-library/react-native'
import type { SearchFilter, SearchHitData, SearchResults } from '@holi/core/screens/search/typesense/types'
import { SearchHitInfiniteList } from '@holi/core/screens/search/typesense/SearchHitInfiniteList'
import type { TrackingEvent } from '@holi/core/tracking'
import {
  hit4,
  profileHit,
  spaceHit,
  toSearchResponseHit,
  volunteeringHit,
} from '@holi/core/screens/search/typesense/__tests__/testData'
import { useSearchResults } from '@holi/core/screens/search/typesense/hooks/useSearchResults'
import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents'

const mockUseSearchResults = jest.mocked(useSearchResults)
jest.mock('@holi/core/screens/search/typesense/hooks/useSearchResults', () => ({
  useSearchResults: jest.fn(),
}))

const removeDeniedProps = (hits: SearchResponseHit<SearchHitData>[]) =>
  hits.map((original) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { link_locators, image_url, ...document } = original.document
    return document
  })

describe('SearchHitInfiniteList', () => {
  const hits: SearchResponseHit<SearchHitData>[] = [volunteeringHit, profileHit, spaceHit].map(toSearchResponseHit)
  const filter: SearchFilter = {
    facet: 'volunteering',
    query: 'search terms',
  }
  const searchResults: SearchResults = {
    hits,
    totalNrOfResults: 4,
    totalNrOfPages: 2,
    currentPage: 1,
    canLoadMore: true,
    filter,
  }

  beforeEach(() => {
    jest.useFakeTimers()
    mockUseSearchResults.mockReturnValue({
      isLoading: false,
      searchResults,
      loadMore: jest.fn(),
      refresh: jest.fn(),
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

  it('should render loader while loading and current results are empty', async () => {
    mockUseSearchResults.mockReturnValue({
      isLoading: true,
      searchResults: {
        hits: [],
        totalNrOfResults: 0,
        totalNrOfPages: 0,
        currentPage: 0,
        canLoadMore: false,
        filter,
      },
      loadMore: jest.fn(),
      refresh: jest.fn(),
    })

    render(<SearchHitInfiniteList filter={filter} onQuerySelect={jest.fn()} />)

    expect(screen.getByTestId('loader')).toBeOnTheScreen()
    expect(await screen.queryByTestId('nextPageLoader')).not.toBeOnTheScreen()
  })

  it('should render search examples for empty query', async () => {
    render(<SearchHitInfiniteList filter={filter} onQuerySelect={jest.fn()} emptyFilter />)

    expect(screen.getByTestId('search-examples')).toBeOnTheScreen()
  })

  it('should render loader while results of an unselected facet are displayed', async () => {
    mockUseSearchResults.mockReturnValue({
      isLoading: true,
      searchResults: {
        ...searchResults,
        filter: {
          query: 'some query',
          facet: 'profile',
        },
      },
      loadMore: jest.fn(),
      refresh: jest.fn(),
    })

    render(<SearchHitInfiniteList filter={filter} onQuerySelect={jest.fn()} />)

    expect(screen.getByTestId('loader')).toBeOnTheScreen()
    expect(await screen.queryByTestId('nextPageLoader')).not.toBeOnTheScreen()
  })

  it('should display text for empty search results', async () => {
    mockUseSearchResults.mockReturnValue({
      isLoading: false,
      searchResults: {
        hits: [],
        totalNrOfResults: 0,
        totalNrOfPages: 0,
        currentPage: 0,
        canLoadMore: false,
        filter,
      },
      loadMore: jest.fn(),
      refresh: jest.fn(),
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
      isLoading: true,
      searchResults: {
        ...searchResults,
        canLoadMore: false,
      },
      loadMore: jest.fn(),
      refresh: jest.fn(),
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
    const loadMore = jest.fn()

    // Mock more hits to be returned when scrolling
    mockUseSearchResults.mockReturnValueOnce({
      isLoading: false,
      searchResults,
      loadMore,
      refresh: jest.fn(),
    })
    mockUseSearchResults.mockReturnValue({
      isLoading: false,
      searchResults: {
        ...searchResults,
        currentPage: 2,
        hits: [...page1, ...page2],
      },
      loadMore,
      refresh: jest.fn(),
    })

    const { rerender } = render(<SearchHitInfiniteList filter={filter} onQuerySelect={jest.fn()} />)

    // simulate time has passed so that debounced tracking function is called
    await jest.runAllTimersAsync()

    // Trigger onEndReached by scrolling to the bottom
    const flatList = screen.getByTestId('search-results-list')
    fireEvent(flatList, 'onEndReached') // Triggers loadMore to fetch new items

    // Check if `loadMore` was called to fetch additional data
    expect(loadMore).toHaveBeenCalled()

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

  it('should refresh on pull-to-refresh', () => {
    const refresh = jest.fn()
    mockUseSearchResults.mockReturnValueOnce({
      isLoading: false,
      searchResults,
      loadMore: jest.fn(),
      refresh,
    })

    render(<SearchHitInfiniteList filter={filter} onQuerySelect={jest.fn()} />)

    // Trigger pull-to-refresh
    const flatList = screen.getByTestId('search-results-list')
    fireEvent(flatList, 'onRefresh')

    expect(refresh).toHaveBeenCalled()
  })
})
