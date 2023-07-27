import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

import { onScreenScrollY } from '@holi/core/helpers'
import RoomItem, { ROOM_ITEM_HEIGHT } from '@holi/core/screens/chat/components/RoomList/RoomItem'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import type { RoomListProps } from './types'

const RoomList = ({ rooms }: RoomListProps) => {
  const mixins = useStyleMixins()

  return (
    <FlatList
      data={rooms}
      renderItem={({ item }) => <RoomItem room={item} />}
      // use ListHeaderComponent to add the List space above for HeaderAnimated
      ListHeaderComponent={() => <View style={styles.listHeaderSpacer} />}
      ListFooterComponent={() => <View style={styles.listFooterSpacer} />}
      ItemSeparatorComponent={() => <View style={styles.listItemSeparator} />}
      keyExtractor={(item) => item.id}
      getItemLayout={(_, index) => ({
        length: ROOM_ITEM_HEIGHT,
        offset: ROOM_ITEM_HEIGHT * index,
        index,
      })}
      onScroll={onScreenScrollY}
      style={[mixins.container, styles.list]}
    />
  )
}

export default RoomList

const styles = StyleSheet.create({
  list: {
    height: '100%',
  },
  listHeaderSpacer: {
    height: vars.topBarHeight,
  },
  listFooterSpacer: {
    height: vars.bottomBarHeight,
  },
  listItemSeparator: {
    borderColor: colors.background30,
    borderTopWidth: 1,
  },
})
