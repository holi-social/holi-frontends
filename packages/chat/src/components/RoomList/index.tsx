import { FlashList } from '@shopify/flash-list'
import React, { memo } from 'react'
import { StyleSheet, View } from 'react-native'

import RoomItem, { ROOM_ITEM_HEIGHT } from '@holi/chat/src/components/RoomList/RoomItem'
import { colors } from '@holi/ui/styles/globalVars'

import type { RoomListProps } from './types'

const RoomList = ({ roomAtoms, loggedInUser }: RoomListProps) => {
  return (
    <FlashList
      data={roomAtoms}
      renderItem={({ item: roomAtom }) => {
        return <RoomItem roomAtom={roomAtom} loggedInUser={loggedInUser} />
      }}
      keyExtractor={(item) => item.toString()}
      estimatedItemSize={ROOM_ITEM_HEIGHT}
      ItemSeparatorComponent={() => <View style={styles.listItemSeparator} />}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      testID={'chat-room-list'}
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
