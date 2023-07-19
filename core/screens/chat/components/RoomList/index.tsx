import { FlashList } from '@shopify/flash-list'
import React, { memo } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import { onScreenScrollY } from '@holi/core/helpers'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import RoomItem, { ROOM_ITEM_HEIGHT } from '@holi/core/screens/chat/components/RoomList/RoomItem'
import { colors, vars } from '@holi/ui/styles/globalVars'

import type { RoomListProps } from './types'

const RoomList = ({ roomAtoms }: RoomListProps) => {
  const { top: safeAreaInsetTop } = useSafeAreaInsets()

  return (
    <FlashList
      data={Object.values(roomAtoms)}
      renderItem={({ item }) => <RoomItem roomAtom={item} />}
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
