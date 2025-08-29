import React, { memo, useMemo } from 'react'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, { LinearTransition } from 'react-native-reanimated'

import { leaveRoom } from '@holi/chat/src/store'
import { HoliTransition } from '@holi/ui/components/atoms/HoliTransition'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import RoomItemDeletable from './RoomItemDeletable'
import type { RoomListProps } from './types'

const RoomList = ({ roomAtoms, loggedInUser }: RoomListProps) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <GestureHandlerRootView style={styles.wrapper}>
      <Animated.FlatList
        data={roomAtoms}
        renderItem={({ item: roomAtom, index }) => (
          <HoliTransition.Fade visible index={index}>
            <RoomItemDeletable roomAtom={roomAtom} loggedInUser={loggedInUser} onDelete={leaveRoom} />
          </HoliTransition.Fade>
        )}
        keyExtractor={(item) => item.toString()}
        ItemSeparatorComponent={() => <View style={styles.listItemSeparator} />}
        itemLayoutAnimation={LinearTransition.springify().damping(14).stiffness(90)}
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
