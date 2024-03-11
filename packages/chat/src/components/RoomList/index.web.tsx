import React, { useMemo } from 'react'
import { FlatList, StyleSheet, View } from 'react-native'

import RoomItem, { ROOM_ITEM_HEIGHT } from '@holi/chat/src/components/RoomList/RoomItem'
import { onScreenScrollY } from '@holi/core/helpers'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import type { RoomListProps } from './types'

const RoomList = ({ roomAtoms, loggedInUser }: RoomListProps) => {
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <FlatList
      data={roomAtoms}
      renderItem={({ item: roomAtom }) => {
        return <RoomItem roomAtom={roomAtom} loggedInUser={loggedInUser} />
      }}
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
      testID={'chat-room-list'}
    />
  )
}

export default RoomList

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    list: {
      height: '100%',
    },
    listFooterSpacer: {
      height: dimensions.bottomBarHeight,
    },
    listItemSeparator: {
      borderColor: theme.colors.background30,
      borderTopWidth: 1,
    },
  })
