import { FlashList } from '@shopify/flash-list'
import React, { memo } from 'react'
import { StyleSheet, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { ROOM_ITEM_HEIGHT } from '@holi/chat/src/components/RoomList/RoomItem'
import RoomItemDeletable from '@holi/chat/src/components/RoomList/RoomItemDeletable'
import { leaveRoom } from '@holi/chat/src/store'
import { colors } from '@holi/ui/styles/globalVars'

import type { RoomListProps } from './types'

const RoomList = ({ roomAtoms, loggedInUser }: RoomListProps) => {
  return (
    <GestureHandlerRootView style={styles.wrapper}>
      <FlashList
        data={roomAtoms}
        renderItem={({ item: roomAtom }) => (
          <RoomItemDeletable roomAtom={roomAtom} loggedInUser={loggedInUser} onDelete={leaveRoom} />
        )}
        keyExtractor={(item) => item.toString()}
        estimatedItemSize={ROOM_ITEM_HEIGHT}
        ItemSeparatorComponent={() => <View style={styles.listItemSeparator} />}
        testID={'chat-room-list'}
      />
    </GestureHandlerRootView>
  )
}

export default memo(RoomList)

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '100%',
  },
  listItemSeparator: {
    borderColor: colors.background30,
    borderTopWidth: 1,
  },
})
