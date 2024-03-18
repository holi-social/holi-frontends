import { FlashList } from '@shopify/flash-list'
import React, { memo, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import { ROOM_ITEM_HEIGHT } from '@holi/chat/src/components/RoomList/RoomItem'
import RoomItemDeletable from '@holi/chat/src/components/RoomList/RoomItemDeletable'
import { leaveRoom } from '@holi/chat/src/store'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import type { RoomListProps } from './types'

const RoomList = ({ roomAtoms, loggedInUser }: RoomListProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      width: '100%',
    },
    listItemSeparator: {
      borderColor: theme.colors.background30,
      borderTopWidth: 1,
    },
  })
