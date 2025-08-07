import { useAtomValue } from 'jotai'
import React, { useMemo } from 'react'
import { StyleSheet, View } from 'react-native'

import RoomItem from '@holi/chat/src/components/RoomList/RoomItem'
import type { ChatRoomAtom, ChatRoomId } from '@holi/chat/src/store'
import type { User } from '@holi/core/domain/shared/types'
import { useBreakpointMatcher } from '@holi/core/helpers'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { breakpoints } from 'holi-bricks/foundations'

interface Props {
  roomAtom: ChatRoomAtom
  loggedInUser: User // optimization to not re-fetch the logged in user on scrolling
  testID?: string
  onDelete: (roomId: ChatRoomId) => void
}

/**
 * @description RoomItemDeletable is buggy on web due to 'Swipeable' component from 'react-native-gesture-handler'
 * (it is not possible to scroll on Chat Room list in Safari iOS).
 * This is a temporary fix for web. The new recommended way is to use 'ReanimatedSwipable' component from a newer version of 'react-native-gesture-handler'.
 * But so for the newer version of 'react-native-gesture-handler' is not compatible with Expo 50 and has bugs on Android.
 */
const RoomItemDeletable = (props: Props) => {
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const paddingHorizontal = useBreakpointMatcher([
    [0, 16],
    [breakpoints.sm, 32],
    [breakpoints.lg, 64],
  ])

  const room = useAtomValue(props.roomAtom)

  return (
    <View>
      <View style={styles.backgroundWrapper}>
        <HoliBox padding={[0, paddingHorizontal ?? 0]}>
          <RoomItem room={room} {...props} />
        </HoliBox>
      </View>
    </View>
  )
}

export default RoomItemDeletable

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    backgroundWrapper: {
      backgroundColor: theme.colors.background20,
    },
  })
