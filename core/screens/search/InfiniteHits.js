import { Text } from 'holi-bricks/components/text/Text'
import React from 'react'
import { useInfiniteHits } from 'react-instantsearch-core'
import { FlatList, StyleSheet, View } from 'react-native'

export function InfiniteHits({ hitComponent: Hit, ...props }) {
  const { items, isLastPage, showMore } = useInfiniteHits({
    ...props,
    escapeHTML: false,
  })

  if (!items.length) {
    return <Text>No search result</Text>
  }

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.objectID}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      onEndReached={() => {
        if (!isLastPage) {
          showMore()
        }
      }}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <Hit hit={item} />
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  item: {
    padding: 18,
  },
})
