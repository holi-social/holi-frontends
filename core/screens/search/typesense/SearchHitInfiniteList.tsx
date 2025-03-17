import { FlashList } from '@shopify/flash-list'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import { HIT_HEIGHT, HIT_HEIGHT_PROFILE, SearchHit } from '@holi/core/screens/search/typesense/SearchHit'
import type { SearchFilter, SearchHitData, SearchResults } from '@holi/core/screens/search/typesense/types'
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

const resultsToTrackingEventResults = (searchResults: SearchResults) => {
  return {
    query: searchResults.filter.query,
    totalNrOfResults: searchResults.totalNrOfResults,
    totalNrOfPages: searchResults.totalNrOfPages,
    currentPage: searchResults.currentPage,
    selectedFacets: [searchResults.filter.facet],
    renderedResults: searchResults.hits.map(({ document }) => hitToTrackingDoc(document)),
  }
}

interface SearchHitInfiniteListProps {
  loadingParameters?: boolean
  filter: SearchFilter
  displayExamples?: boolean
  onQuerySelect: (query: string) => void
}

export function SearchHitInfiniteList({
  loadingParameters,
  filter,
  displayExamples = false,
  onQuerySelect,
}: SearchHitInfiniteListProps) {
  const { track } = useTracking()
  const { styles } = useStyles(stylesheet)
  const { searchResults, loadMore, refresh } = useSearchResults(filter)
  const isLoading = loadingParameters || searchResults.isLoading

  const fullRefresh = useOnRefresh(refresh)

  // using debounce as the best approximation to "results have been rendered" that we could find. tried alternatives:
  // a) observing items updates (too frequent with in between empty states)
  // b) observing render state of FlatList (gets complex quickly, tricky to get right)
  const trackResultsViewed = useDebounce(() => {
    track(TrackingEvent.SearchResultsRendered(resultsToTrackingEventResults(searchResults)))
  }, 1000)

  useEffect(() => {
    trackResultsViewed()
  }, [searchResults.hits, trackResultsViewed])

  const itemHeight = filter.facet === 'profile' ? HIT_HEIGHT_PROFILE : HIT_HEIGHT

  return (
    <FlashList
      contentContainerStyle={styles.list}
      testID={'search-results-list'}
      estimatedItemSize={itemHeight + Spacing['xs']}
      data={searchResults.hits}
      keyExtractor={(item) => item.document.id}
      ItemSeparatorComponent={() => <HoliGap size={'s'} />}
      ListEmptyComponent={
        isLoading && !displayExamples ? (
          <HoliLoader style={styles.loader} testID="loader" />
        ) : displayExamples ? (
          <SearchExamples onQuerySelect={onQuerySelect} currentFacet={filter.facet} />
        ) : (
          <NoSearchResults filter={filter} />
        )
      }
      ListFooterComponent={() => {
        if (searchResults.hits.length > 0 && searchResults.canLoadMore) {
          return <HoliLoader style={styles.loader} testID="nextPageLoader" />
        }
        return null
      }}
      refreshing={false}
      onRefresh={isWeb ? undefined : fullRefresh}
      onEndReached={() => {
        if (searchResults.canLoadMore && !isLoading) {
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
                searchResult: resultsToTrackingEventResults(searchResults),
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
