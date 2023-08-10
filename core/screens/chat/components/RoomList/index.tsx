import { FlashList } from '@shopify/flash-list'
import React, { memo } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import RoomItem, { ROOM_ITEM_HEIGHT } from '@holi/core/screens/chat/components/RoomList/RoomItem'
import { colors, vars } from '@holi/ui/styles/globalVars'

import { useRoomAtomUserMap } from './helpers'
import type { RoomListProps } from './types'

const RoomList = ({ roomAtoms }: RoomListProps) => {
  const { top: safeAreaInsetTop } = useSafeAreaInsets()
  const { roomAtomUserMap, loading } = useRoomAtomUserMap()

  return (
    <FlashList
      data={roomAtoms}
      renderItem={({ item: roomAtom }) => {
        const user = roomAtomUserMap.get(roomAtom)
        // `useRoomAtomUserMap` loads a bunch of users and can be triggered multiple times.
        // `loading` indicator represents a loading state of the whole bunch.
        // So, to check individually each item preperation we check if a user for current RoomItem is loaded, if he is not, we check if `loading` is active
        const isRoomItemLoading = !user && loading
        return <RoomItem roomAtom={roomAtom} user={user} loading={isRoomItemLoading} />
      }}
      extraData={roomAtomUserMap}
      keyExtractor={(item) => item.toString()}
      estimatedItemSize={ROOM_ITEM_HEIGHT}
      ListHeaderComponent={() => (
        <View style={{ height: +vars.topBarHeight + (Platform.OS === 'android' ? safeAreaInsetTop : 0) }} />
      )}
      ItemSeparatorComponent={() => <View style={styles.listItemSeparator} />}
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
