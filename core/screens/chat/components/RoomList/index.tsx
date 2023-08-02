import { FlashList } from '@shopify/flash-list'
import React, { memo } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import { onScreenScrollY } from '@holi/core/helpers'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import RoomItem, { ROOM_ITEM_HEIGHT } from '@holi/core/screens/chat/components/RoomList/RoomItem'
import { colors, vars } from '@holi/ui/styles/globalVars'

import { useRoomIdUserRecord } from './helpers'
import type { RoomListProps } from './types'

const RoomList = ({ roomAtoms }: RoomListProps) => {
  const { top: safeAreaInsetTop } = useSafeAreaInsets()
  const { roomIdUserRecord, loading } = useRoomIdUserRecord()

  return (
    <FlashList
      data={Object.entries(roomAtoms)}
      renderItem={({ item: [roomId, roomAtom] }) => (
        <RoomItem roomAtom={roomAtom} user={roomIdUserRecord[roomId]} loading={loading} />
      )}
      keyExtractor={(item) => item.toString()}
      estimatedItemSize={ROOM_ITEM_HEIGHT}
      ListHeaderComponent={() => (
        <View style={{ height: +vars.topBarHeight + (Platform.OS === 'android' ? safeAreaInsetTop : 0) }} />
      )}
      ItemSeparatorComponent={() => <View style={styles.listItemSeparator} />}
      onScroll={onScreenScrollY}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    />
  )
}

export default memo(RoomList)

const styles = StyleSheet.create({
  listItemSeparator: {
    borderColor: colors.background30,
    borderTopWidth: 1,
  },
})
