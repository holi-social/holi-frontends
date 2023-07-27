import { FlashList } from '@shopify/flash-list'
import React, { memo } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import { onScreenScrollY } from '@holi/core/helpers'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import RoomItem, { ROOM_ITEM_HEIGHT } from '@holi/core/screens/chat/components/RoomList/RoomItem'
import { colors, vars } from '@holi/ui/styles/globalVars'

import type { RoomListProps } from './types'

const RoomList = ({ rooms }: RoomListProps) => {
  const { top: safeAreaInsetTop } = useSafeAreaInsets()

  return (
    <FlashList
      data={rooms}
      renderItem={({ item }) => <RoomItem room={item} />}
      keyExtractor={(item) => item.id}
      estimatedItemSize={ROOM_ITEM_HEIGHT}
      ListHeaderComponent={() => (
        <View style={{ height: safeAreaInsetTop + (Platform.OS === 'android' ? +vars.topBarHeight : 0) }} />
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
