import { FlashList } from '@shopify/flash-list'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import { SearchHit } from '@holi/core/screens/search/SearchHit'
import type { SearchFilter, SearchResults } from '@holi/core/screens/search/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import { hitToTrackingDoc } from '@holi/core/screens/search/tracking'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useDebounce } from '@holi/ui/helper'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { Spacing } from 'holi-bricks/foundations'
import { NoSearchResults } from '@holi/core/screens/search/NoSearchResults'
import { useSearchResults } from '@holi/core/screens/search/hooks/useSearchResults'
import { SearchExamples } from '@holi/core/screens/search/SearchExamples'
import { isEmptyFilter } from '@holi/core/screens/search/helpers/isEmptyFilter'
import type { SearchResponseHit } from '@holi/core/typesense/types'

const isWeb = Platform.OS === 'web'

const resultsToTrackingEventResults = (searchResults: SearchResults, filter: SearchFilter) => {
  return {
    query: filter.query,
    totalNrOfResults: searchResults.totalResults,
    totalNrOfPages: searchResults.totalNrOfPages,
    currentPage: searchResults.currentPage,
    selectedFacets: [filter.facet],
    renderedResults: searchResults.hits.map(({ document }) => hitToTrackingDoc(document)),
  }
}

interface SearchHitInfiniteListProps {
  loadingParameters?: boolean
  filter: SearchFilter
  onQuerySelect: (query: string) => void
}

export const SearchHitInfiniteList = ({ loadingParameters, filter, onQuerySelect }: SearchHitInfiniteListProps) => {
  const { track } = useTracking()
  const { styles } = useStyles(stylesheet)
  const { searchResults, isLoading: loadingResults, fetchNextPage, refetch } = useSearchResults(filter)
  const isLoading = loadingParameters || loadingResults

  const fullRefresh = useOnRefresh(refetch)

  // using debounce as the best approximation to "results have been rendered" that we could find. tried alternatives:
  // a) observing items updates (too frequent with in between empty states)
  // b) observing render state of FlatList (gets complex quickly, tricky to get right)
  const trackResultsViewed = useDebounce(() => {
    track(TrackingEvent.SearchResultsRendered(resultsToTrackingEventResults(searchResults, filter)))
  }, 1000)

  useEffect(() => {
    trackResultsViewed()
  }, [searchResults.hits, trackResultsViewed])

  const emptyFilter = isEmptyFilter(filter)

  return (
    <FlashList
      contentContainerStyle={styles.list}
      testID={'search-results-list'}
      data={searchResults.hits}
      keyExtractor={(item) => item.document.id}
      ItemSeparatorComponent={() => <HoliGap size={'s'} />}
      ListEmptyComponent={
        isLoading && !emptyFilter ? (
          <HoliLoader style={styles.loader} testID="loader" />
        ) : emptyFilter ? (
          <SearchExamples onQuerySelect={onQuerySelect} currentFacet={filter.facet} />
        ) : (
          <NoSearchResults filter={filter} />
        )
      }
      ListFooterComponent={() => {
        if (searchResults.hits.length > 0 && searchResults.canFetchMore) {
          return <HoliLoader style={styles.loader} testID="nextPageLoader" />
        }
        return null
      }}
      refreshing={false}
      onRefresh={isWeb ? undefined : fullRefresh}
      onEndReached={() => {
        if (searchResults.canFetchMore && !isLoading) {
          fetchNextPage()
        }
      }}
      onEndReachedThreshold={0.5}
      renderItem={({ item, index }: { item: Omit<SearchResponseHit, 'highlight'>; index: number }) => {
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
                searchResult: resultsToTrackingEventResults(searchResults, filter),
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
