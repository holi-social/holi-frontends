import { FlashList } from '@shopify/flash-list'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import { HIT_HEIGHT, SearchHit } from '@holi/core/screens/search/typesense/SearchHit'
import type { SearchHitData } from '@holi/core/screens/search/typesense/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import React, { useEffect } from 'react'
import { useInfiniteHits, useInstantSearch } from 'react-instantsearch-core'
import { Platform } from 'react-native'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import { hitToTrackingDoc } from '@holi/core/screens/search/typesense/tracking'
import type { SearchResults } from 'algoliasearch-helper'
import type { Hit } from 'instantsearch.js'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useDebounce } from '@holi/ui/helper'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { Spacing } from 'holi-bricks/tokens'
import { NoSearchResults } from '@holi/core/screens/search/typesense/NoSearchResults'

const isWeb = Platform.OS === 'web'

const resultsToTrackingEventResults = (results: SearchResults<Hit<SearchHitData>>) => {
  return {
    query: results.query,
    totalNrOfResults: results.nbHits,
    totalNrOfPages: results.nbPages,
    currentPage: results.page,
    selectedFacets: results.getRefinements().map((refinement) => refinement.name),
    renderedResults: results.hits.map(hitToTrackingDoc),
  }
}

export function SearchHitInfiniteList() {
  const { items, isLastPage, showMore, results } = useInfiniteHits<SearchHitData>({
    escapeHTML: false,
  })
  // Debouncing showMore as workaround for a race condition when changing the query (otherwise page 0 might be skipped)
  const debouncedShowMore = useDebounce(() => showMore?.(), 100)

  const { track } = useTracking()
  const { status, refresh } = useInstantSearch()
  const { styles } = useStyles(stylesheet)
  const isLoading = status === 'loading' || status === 'stalled'

  const fullRefresh = useOnRefresh(refresh)

  // using debounce as the best approximation to "results have been rendered" that we could find. tried alternatives:
  // a) observing items updates (too frequent with in between empty states)
  // b) hooking into Instantsearch.js internal states (too frequent with in between empty states)
  // c) observing render state of FlatList (gets complex quickly, tricky to get right)
  const trackResultsViewed = useDebounce(() => {
    // practically, results are always defined (just to make type checker happy)
    if (results !== undefined) {
      track(TrackingEvent.SearchResultsRendered(resultsToTrackingEventResults(results)))
    }
  }, 1000)

  useEffect(() => {
    trackResultsViewed()
  }, [items, trackResultsViewed])

  // Hide results of empty query
  const isEmptyQuery = !results?.query || results?.query === '*'
  const displayedItems = isEmptyQuery ? [] : items.length ? items : results?.hits

  return (
    <FlashList
      contentContainerStyle={styles.list}
      testID={'search-results-list'}
      estimatedItemSize={HIT_HEIGHT + Spacing['xs']}
      data={displayedItems}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <HoliGap size={'s'} />}
      ListEmptyComponent={
        isLoading || isEmptyQuery ? (
          <HoliLoader style={styles.loader} testID="loader" />
        ) : (
          <NoSearchResults query={results?.query ?? ''} />
        )
      }
      ListFooterComponent={() => {
        if (displayedItems.length > 0 && !isLastPage) {
          return <HoliLoader style={styles.loader} testID="nextPageLoader" />
        }
        return null
      }}
      refreshing={false}
      onRefresh={isWeb ? undefined : fullRefresh}
      onEndReached={() => {
        if (!isLastPage && !isEmptyQuery) {
          debouncedShowMore()
        }
      }}
      onEndReachedThreshold={0.5}
      renderItem={({ item: hit, index }: { item: SearchHitData; index: number }) => {
        return (
          <ErrorBoundary>
            <SearchHit
              hit={hit}
              trackingEvent={TrackingEvent.SearchResultPressed({
                itemPressed: hitToTrackingDoc(hit),
                itemPressedIndex: index,
                itemPressedType: hit.type,
                itemPressedTitleDe: hit.type === 'profile' ? hit.user_full_name : hit.title_de,
                itemPressedTitleEn: hit.type === 'profile' ? hit.user_full_name : hit.title_en,
                searchResult: resultsToTrackingEventResults(results!), // eslint-disable-line @typescript-eslint/no-non-null-assertion
              })}
            />
          </ErrorBoundary>
        )
      }}
    />
  )
}

const stylesheet = createStyleSheet({
  loader: {
    padding: Spacing['xxs'],
    position: 'relative',
  },
  list: {
    paddingVertical: Spacing['xs'],
    paddingHorizontal: Spacing['xs'],
  },
})
