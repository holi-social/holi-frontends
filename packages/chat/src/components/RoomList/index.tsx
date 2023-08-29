import { FlashList } from '@shopify/flash-list'
import React, { memo } from 'react'
import { Platform, StyleSheet, View } from 'react-native'

import RoomItem, { ROOM_ITEM_HEIGHT } from '@holi/chat/src/components/RoomList/RoomItem'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import { colors, vars } from '@holi/ui/styles/globalVars'

import type { RoomListProps } from './types'

const RoomList = ({ roomAtoms, loggedInUser }: RoomListProps) => {
  const { top: safeAreaInsetTop } = useSafeAreaInsets()

  return (
    <FlashList
      data={roomAtoms}
      renderItem={({ item: roomAtom }) => {
        return <RoomItem roomAtom={roomAtom} loggedInUser={loggedInUser} />
      }}
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
