import { FlashList } from '@shopify/flash-list'
import React, { memo, useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import RoomItem, { ROOM_ITEM_HEIGHT } from '@holi/chat/src/components/RoomList/RoomItem'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import type { RoomListProps } from './types'

const RoomList = ({ roomAtoms, loggedInUser }: RoomListProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    listItemSeparator: {
      borderColor: theme.colors.background30,
      borderTopWidth: 1,
    },
  })
