import { SearchHit } from '@holi/core/screens/search/typesense/SearchHit'
import { SearchHitData } from '@holi/core/screens/search/typesense/types'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { Text } from 'holi-bricks/components/text'
import React from 'react'
import { useInfiniteHits } from 'react-instantsearch-core'
import { UseInfiniteHitsProps } from 'react-instantsearch-core/dist/es/connectors/useInfiniteHits'
import { FlatList } from 'react-native'

export type InfiniteHitsProps = {
  props?: UseInfiniteHitsProps<SearchHitData>
}

export function InfiniteHits(props: InfiniteHitsProps) {
  const { items, isLastPage, showMore } = useInfiniteHits<SearchHitData>({
    ...props,
    escapeHTML: false,
  })

  // TODO i18n
  if (!items.length) {
    return <Text size={'md'}>No search results</Text>
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
