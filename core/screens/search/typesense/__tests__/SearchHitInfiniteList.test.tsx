import React from 'react'
import { fireEvent, render, screen, userEvent } from '@testing-library/react-native'
import { useInfiniteHits, useInstantSearch } from 'react-instantsearch-core'
import { InfiniteHitsRenderState } from 'instantsearch.js/es/connectors/infinite-hits/connectInfiniteHits'
import { Hit } from 'instantsearch.js'
import { SearchHitData } from '@holi/core/screens/search/typesense/types'
import { SearchResults } from 'algoliasearch-helper'
import { SearchHitInfiniteList } from '@holi/core/screens/search/typesense/SearchHitInfiniteList'
import { TrackingEvent } from '@holi/core/tracking'

jest.mock('react-instantsearch-core')
const mockUseInfiniteHits = jest.mocked(useInfiniteHits)
const mockUseInstantSearch = jest.mocked(useInstantSearch)

const hit1: Hit<SearchHitData> = {
  type: 'volunteering',
  id: '1',
  title_de: 'Freiwilligenarbeit in Berlin',
  title_en: 'Volunteering in Berlin',
  description_de: 'Hilf deiner Gemeinschaft als Freiwilliger.',
  description_en: 'Help your community through volunteering.',
  location: 'Berlin',
  location_lat_lng: [52.52, 13.405],
  image_url: 'https://example.com/image1.jpg',
  link_locators: {
    volunteering: 'volunteer-opportunity-1',
  },
  __position: 0,
  __queryID: '1',
  objectID: '1',
}

const hit2: Hit<SearchHitData> = {
  type: 'profile',
  id: '2',
  title_de: 'Profil von Max Mustermann',
  title_en: 'Profile of Max Mustermann',
  description_de: 'Erfahre mehr über Max.',
  description_en: 'Learn more about Max.',
  image_url: 'https://example.com/image2.jpg',
  link_locators: {
    profile: 'max-mustermann',
  },
  __position: 1,
  __queryID: '1',
  objectID: '2',
}

const hit3: Hit<SearchHitData> = {
  type: 'space',
  id: '3',
  title_de: 'Coworking Space in Mitte',
  title_en: 'Coworking Space in Mitte',
  description_de: 'Arbeite in einem kreativen Raum.',
  description_en: 'Work in a creative space.',
  location: 'Mitte, Berlin',
  location_lat_lng: [52.53, 13.4],
  image_url: 'https://example.com/image3.jpg',
  link_locators: {
    space: 'coworking-mitte',
  },
  __position: 2,
  __queryID: '1',
  objectID: '3',
}

const hit4: Hit<SearchHitData> = {
  type: 'space',
  id: '4',
  title_de: 'Neuer Coworking Space',
  title_en: 'New Coworking Space',
  description_de: 'Ein weiterer kreativer Raum.',
  description_en: 'Another creative space.',
  location: 'Prenzlauer Berg, Berlin',
  location_lat_lng: [52.54, 13.41],
  image_url: 'https://example.com/image4.jpg',
  link_locators: {
    space: 'coworking-prenzlauer',
  },
  __position: 3,
  __queryID: '1',
  objectID: '4',
}

const removeBlacklistedProps = (hits: Array<Hit<SearchHitData>>) =>
  hits.map((original) => {
    const hit = { ...original } as Partial<Hit<SearchHitData>>
    delete hit['__position']
    delete hit['__queryID']
    delete hit['objectID']
    delete hit['link_locators']
    delete hit['image_url']
    return hit as Hit<SearchHitData>
  })

const mockedInfiniteHits = (
  nbHits: number,
  nbPages: number,
  page: number,
  hits: Array<Hit<SearchHitData>>
): InfiniteHitsRenderState<Hit<SearchHitData>> => ({
  showPrevious: jest.fn(),
  showMore: jest.fn(),
  isFirstPage: true,
  isLastPage: false,
  sendEvent: jest.fn(),
  bindEvent: jest.fn(),
  currentPageHits: hits,
  hits: hits,
  items: hits,
  // only mock properties used in implementation of SearchHitInfiniteList (results is a huge complex object)
  results: {
    query: 'search terms',
    hits,
    nbHits,
    nbPages,
    page,
    getRefinements: () => [{ name: 'user' } as SearchResults.Refinement],
  } as SearchResults<Hit<SearchHitData>>,
})

jest.useFakeTimers()

describe('SearchHitInfiniteList', () => {
  beforeEach(() => {
    mockUseInfiniteHits.mockReturnValue(mockedInfiniteHits(4, 2, 0, [hit1, hit2, hit3]))
    mockUseInstantSearch.mockReturnValue({ status: 'idle' } as ReturnType<typeof useInstantSearch>)
  })
  it('tracks searchResultsRendered event', async () => {
    render(<SearchHitInfiniteList />)

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
        currentPage: 0,
        renderedResults: removeBlacklistedProps([hit1, hit2, hit3]),
        selectedFacets: ['user'],
      },
    } as TrackingEvent)
  })
  it('tracks searchResultPressed event', async () => {
    const user = userEvent.setup()
    render(<SearchHitInfiniteList />)

    // simulate time has passed so that debounced tracking function is called
    await jest.runAllTimersAsync()

    mockTrack.mockReset() // we're not interested in the searchResultsRendered event

    // press second item
    await user.press(screen.getAllByLabelText(hit2.title_en!)[0]) // eslint-disable-line @typescript-eslint/no-non-null-assertion

    expect(mockTrack).toHaveBeenCalledWith({
      name: 'searchResultPressed',
      event_version__major: 1,
      event_version__minor: 0,
      event_version__patch: 0,
      properties: {
        itemPressed: removeBlacklistedProps([hit2])[0],
        itemPressedIndex: 1,
        query: 'search terms',
        totalNrOfResults: 4,
        totalNrOfPages: 2,
        currentPage: 0,
        renderedResults: removeBlacklistedProps([hit1, hit2, hit3]),
        selectedFacets: ['user'],
      },
    } as TrackingEvent)
  })
  it('fetches more data on scroll and fires another searchResultsRendered tracking event', async () => {
    const page1 = [hit1, hit2, hit3]
    const page2 = [hit4]

    // Mock more hits to be returned when scrolling
    const mockShowMore = jest.fn(() => {
      mockUseInfiniteHits.mockReturnValueOnce(mockedInfiniteHits(4, 2, 1, [...page1, ...page2]))
    })

    mockUseInfiniteHits.mockReturnValueOnce({
      ...mockedInfiniteHits(4, 2, 0, page1),
      showMore: mockShowMore,
    })

    const { rerender } = render(<SearchHitInfiniteList />)

    // simulate time has passed so that debounced tracking function is called
    await jest.runAllTimersAsync()

    // Trigger onEndReached by scrolling to the bottom
    const flatList = screen.getByTestId('search-results-list')
    fireEvent(flatList, 'onEndReached') // Triggers showMore to fetch new items

    // Check if `showMore` was called to fetch additional data
    expect(mockShowMore).toHaveBeenCalled()

    rerender(<SearchHitInfiniteList />)

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
        currentPage: 1,
        renderedResults: removeBlacklistedProps([...page1, ...page2]), // Adjust for newly fetched results if needed
        selectedFacets: ['user'],
      },
    })
  })
})
