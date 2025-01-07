import { SearchHit } from '@holi/core/screens/search/typesense/SearchHit'
import { SearchHitData } from '@holi/core/screens/search/typesense/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { Text } from 'holi-bricks/components/text'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteHits } from 'react-instantsearch-core'
import { FlatList } from 'react-native'

export function SearchHitInfiniteList() {
  const { t } = useTranslation()
  const { items, isLastPage, showMore } = useInfiniteHits<SearchHitData>({
    escapeHTML: false,
  })

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.objectID}
      ItemSeparatorComponent={() => <HoliGap size={'s'} />}
      ListEmptyComponent={<Text size={'md'}>{t('global.noSearchResults')}</Text>}
      onEndReached={() => {
        if (!isLastPage) {
          showMore()
        }
      }}
      renderItem={({ item }) => <SearchHit hit={item} />}
    />
  )
}
