import { SearchHit } from '@holi/core/screens/search/typesense/SearchHit'
import { SearchHitData } from '@holi/core/screens/search/typesense/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { Text } from 'holi-bricks/components/text'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteHits, useInstantSearch } from 'react-instantsearch-core'
import { FlatList, View } from 'react-native'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { TrackingEvent } from '@holi/core/tracking'
import { hitToTrackingDoc } from '@holi/core/screens/search/typesense/tracking'
import { SearchResults } from 'algoliasearch-helper'
import { Hit } from 'instantsearch.js'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useDebounce } from '@holi/ui/helper'
import { dimensions } from '@holi/ui/styles/globalVars'

// TODO restyle after introducing <Screen> component (HOLI-10827)
const LoadingState = () => {
  return (
    <View style={{ padding: dimensions.spacingSM }}>
      <HoliLoader />
    </View>
  )
}

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
  const { t } = useTranslation()
  const { items, isLastPage, showMore, results } = useInfiniteHits<SearchHitData>({
    escapeHTML: false,
  })
  const { track } = useTracking()
  const { status } = useInstantSearch()

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

  return (
    <FlatList
      testID={'search-results-list'}
      data={items}
      keyExtractor={(item) => item.id}
      ItemSeparatorComponent={() => <HoliGap size={'s'} />}
      ListEmptyComponent={
        status === 'loading' || status === 'stalled' ? (
          <LoadingState />
        ) : (
          <Text size={'md'}>{t('global.noSearchResults')}</Text>
        )
      }
      onEndReached={() => {
        if (!isLastPage) {
          showMore()
        }
      }}
      renderItem={({ item: hit, index }: { item: SearchHitData; index: number }) => {
        return (
          <SearchHit
            hit={hit}
            trackingEvent={TrackingEvent.SearchResultPressed({
              itemPressed: hitToTrackingDoc(hit),
              itemPressedIndex: index,
              itemPressedType: hit.type,
              itemPressedTitleDe: hit.title_de,
              itemPressedTitleEn: hit.title_en,
              searchResult: resultsToTrackingEventResults(results!), // eslint-disable-line @typescript-eslint/no-non-null-assertion
            })}
          />
        )
      }}
    />
  )
}
