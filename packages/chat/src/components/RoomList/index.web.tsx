import React, { useMemo } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated'

import { leaveRoom } from '@holi/chat/src/store'
import { onScreenScrollY } from '@holi/core/helpers'
import { dimensions } from '@holi/ui/styles/globalVars'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import { ROOM_ITEM_HEIGHT } from './RoomItem'
import RoomItemDeletable from './RoomItemDeletable'
import type { RoomListProps } from './types'

const RoomList = ({ roomAtoms, loggedInUser }: RoomListProps) => {
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <Animated.FlatList
      data={roomAtoms}
      renderItem={({ item: roomAtom }) => (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <RoomItemDeletable roomAtom={roomAtom} loggedInUser={loggedInUser} onDelete={leaveRoom} />
        </Animated.View>
      )}
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
      itemLayoutAnimation={LinearTransition}
      testID={'chat-room-list'}
    />
  )
}

export default RoomList

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    list: {
      height: '100%',
      paddingHorizontal: 0,
    },
    listFooterSpacer: {
      height: dimensions.bottomBarHeight,
    },
    listItemSeparator: {
      borderColor: theme.colors.background30,
      borderTopWidth: 1,
    },
    listItemWrapper: {
      backgroundColor: theme.colors.background20,
    },
  })
