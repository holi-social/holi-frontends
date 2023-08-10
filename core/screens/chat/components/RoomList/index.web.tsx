import React from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

import { onScreenScrollY } from '@holi/core/helpers'
import RoomItem, { ROOM_ITEM_HEIGHT } from '@holi/core/screens/chat/components/RoomList/RoomItem'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { useRoomAtomUserMap } from './helpers'
import type { RoomListProps } from './types'

const RoomList = ({ roomAtoms }: RoomListProps) => {
  const mixins = useStyleMixins()
  const { roomAtomUserMap, loading } = useRoomAtomUserMap()

  return (
    <FlatList
      data={roomAtoms}
      renderItem={({ item: roomAtom }) => (
        <RoomItem roomAtom={roomAtom} user={roomAtomUserMap.get(roomAtom) ?? null} loading={loading} />
      )}
      // use ListHeaderComponent to add the List space above for HeaderAnimated
      ListHeaderComponent={() => <View style={styles.listHeaderSpacer} />}
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
