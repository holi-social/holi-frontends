import { FlashList } from '@shopify/flash-list'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import { HIT_HEIGHT, HIT_HEIGHT_PROFILE, SearchHit } from '@holi/core/screens/search/typesense/SearchHit'
import type { SearchFilter, SearchHitData } from '@holi/core/screens/search/typesense/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import { hitToTrackingDoc } from '@holi/core/screens/search/typesense/tracking'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useDebounce } from '@holi/ui/helper'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { Spacing } from 'holi-bricks/tokens'
import { NoSearchResults } from '@holi/core/screens/search/typesense/NoSearchResults'
import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents'
import { useSearchResults } from '@holi/core/screens/search/typesense/hooks/useSearchResults'
import { SearchExamples } from '@holi/core/screens/search/typesense/SearchExamples'

const isWeb = Platform.OS === 'web'

const resultsToTrackingEventResults = (results: SearchResponseHit<SearchHitData>[], filter: SearchFilter) => {
  return {
    query: filter.query,
    // TODO(SF) are those all needed?
    totalNrOfResults: 1, // results.nbHits,
    totalNrOfPages: 1, //results.nbPages,
    currentPage: 1, //results.page,
    selectedFacets: [filter.facet],
    renderedResults: results.map(({ document }) => hitToTrackingDoc(document)),
  }
}

interface SearchHitInfiniteListProps {
  loadingParameters?: boolean
  filter: SearchFilter
  isFilterEmpty: boolean
  onQuerySelect: (query: string) => void
}

export function SearchHitInfiniteList({
  loadingParameters,
  filter,
  isFilterEmpty,
  onQuerySelect,
}: SearchHitInfiniteListProps) {
  const { track } = useTracking()
  const { styles } = useStyles(stylesheet)
  const { isLoading: loadingResults, results, canLoadMore, loadMore, refresh } = useSearchResults(filter)
  const displayedFacet = results.length && results[0].document.type
  const oldResults = displayedFacet && displayedFacet !== filter.facet
  const isLoading = loadingParameters || loadingResults || oldResults

  const fullRefresh = useOnRefresh(refresh)

  // using debounce as the best approximation to "results have been rendered" that we could find. tried alternatives:
  // a) observing items updates (too frequent with in between empty states)
  // b) observing render state of FlatList (gets complex quickly, tricky to get right)
  const trackResultsViewed = useDebounce(() => {
    if (results) {
      track(TrackingEvent.SearchResultsRendered(resultsToTrackingEventResults(results, filter)))
    }
  }, 1000)

  useEffect(() => {
    trackResultsViewed()
  }, [results, trackResultsViewed])

  // Hide results of empty query or wrong facet
  const displayedItems = isFilterEmpty || oldResults ? [] : (results ?? [])
  const itemHeight = filter.facet === 'profile' ? HIT_HEIGHT_PROFILE : HIT_HEIGHT

  return (
    <FlashList
      contentContainerStyle={styles.list}
      testID={'search-results-list'}
      estimatedItemSize={itemHeight + Spacing['xs']}
      data={displayedItems}
      keyExtractor={(item) => item.document.id}
      ItemSeparatorComponent={() => <HoliGap size={'s'} />}
      ListEmptyComponent={
        isLoading && !isFilterEmpty ? (
          <HoliLoader style={styles.loader} testID="loader" />
        ) : isFilterEmpty ? (
          <SearchExamples onQuerySelect={onQuerySelect} currentFacet={filter.facet} />
        ) : (
          <NoSearchResults query={filter.query} />
        )
      }
      ListFooterComponent={() => {
        if (displayedItems.length > 0 && canLoadMore) {
          return <HoliLoader style={styles.loader} testID="nextPageLoader" />
        }
        return null
      }}
      refreshing={false}
      onRefresh={isWeb ? undefined : fullRefresh}
      onEndReached={() => {
        if (canLoadMore && !isLoading) {
          loadMore()
        }
      }}
      onEndReachedThreshold={0.5}
      renderItem={({ item, index }: { item: SearchResponseHit<SearchHitData>; index: number }) => {
        const hit = item.document
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
                searchResult: resultsToTrackingEventResults(results, filter),
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
