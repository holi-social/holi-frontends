import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

import RoomItem, { ROOM_ITEM_HEIGHT } from '@holi/chat/src/components/RoomList/RoomItem'
import { onScreenScrollY } from '@holi/core/helpers'
import { colors, dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import type { RoomListProps } from './types'

const RoomList = ({ roomAtoms, loggedInUser }: RoomListProps) => {
  const mixins = useStyleMixins()

  return (
    <FlatList
      data={roomAtoms}
      renderItem={({ item: roomAtom }) => {
        return <RoomItem roomAtom={roomAtom} loggedInUser={loggedInUser} />
      }}
      ListFooterComponent={() => <View style={styles.listFooterSpacer} />}
      ItemSeparatorComponent={() => <View style={styles.listItemSeparator} />}
      keyExtractor={(item) => item.toString()}
      getItemLayout={(_, index) => ({
        length: ROOM_ITEM_HEIGHT,
        offset: ROOM_ITEM_HEIGHT * index,
        index,
      })}
      onScroll={onScreenScrollY}
      style={[mixins.container, styles.list]}
      testID={'chat-room-list'}
    />
  )
}

export default RoomList

const styles = StyleSheet.create({
  list: {
    height: '100%',
  },
  listFooterSpacer: {
    height: dimensions.bottomBarHeight,
  },
  listItemSeparator: {
    borderColor: colors.background30,
    borderTopWidth: 1,
  },
})
