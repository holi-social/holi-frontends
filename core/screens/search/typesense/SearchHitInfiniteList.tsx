import { SearchHit } from '@holi/core/screens/search/typesense/SearchHit'
import { SearchHitData } from '@holi/core/screens/search/typesense/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { Text } from 'holi-bricks/components/text'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteHits, useInstantSearch } from 'react-instantsearch-core'
import { FlatList, View } from 'react-native'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { dimensions } from '@holi/ui/styles/globalVars'

// TODO restyle after introducing <Screen> component (HOLI-10827)
const LoadingState = () => {
  return (
    <View style={{ padding: dimensions.spacingSM }}>
      <HoliLoader />
    </View>
  )
}

export function SearchHitInfiniteList() {
  const { t } = useTranslation()
  const { items, isLastPage, showMore } = useInfiniteHits<SearchHitData>({
    escapeHTML: false,
  })
  const { status } = useInstantSearch()

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.objectID}
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
      renderItem={({ item }) => <SearchHit hit={item} />}
    />
  )
}
