import { SearchHit } from '@holi/core/screens/search/typesense/SearchHit'
import { SearchHitData } from '@holi/core/screens/search/typesense/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { Text } from 'holi-bricks/components/text'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteHits } from 'react-instantsearch-core'
import { UseInfiniteHitsProps } from 'react-instantsearch-core/dist/es/connectors/useInfiniteHits'
import { FlatList } from 'react-native'

export type InfiniteHitsProps = {
  props?: UseInfiniteHitsProps<SearchHitData>
}

export function InfiniteHits(props: InfiniteHitsProps) {
  const { t } = useTranslation()
  const { items, isLastPage, showMore } = useInfiniteHits<SearchHitData>({
    ...props,
    escapeHTML: false,
  })

  if (!items.length) {
    return <Text size={'md'}>{t('global.noSearchResults')}</Text>
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.objectID}
      ItemSeparatorComponent={() => <HoliGap size={'s'} />}
      onEndReached={() => {
        if (!isLastPage) {
          showMore()
        }
      }}
      renderItem={({ item }) => <SearchHit hit={item} />}
    />
  )
}
