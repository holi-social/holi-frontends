import { useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import RoomItem from '@holi/chat/src/components/RoomList/RoomItem'
import type { ChatRoomAtom, ChatRoomId } from '@holi/chat/src/store'
import { useBreakpointMatcher } from '@holi/core/helpers'
import { User } from '@holi/core/screens/userprofile/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Delete } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliSwipeable from '@holi/ui/components/molecules/HoliSwipeable'
import { colors, dimensions } from '@holi/ui/styles/globalVars'

interface Props {
  roomAtom: ChatRoomAtom
  loggedInUser: User // optimization to not re-fetch the logged in user on scrolling
  testID?: string
  onDelete: (roomId: ChatRoomId) => void
}

const RoomItemDeletable = ({ onDelete, ...props }: Props) => {
  const { t } = useTranslation()
  const paddingHorizontal = useBreakpointMatcher([
    [0, 16],
    [dimensions.breakpointS, 32],
    [dimensions.breakpointL, 64],
  ])

  const [isDeleting, setIsDeleting] = useState(false)

  const room = useAtomValue(props.roomAtom)
  const deleteRoomItemHandler = () => {
    setIsDeleting(true)
    onDelete(room.id)
  }

  return (
    <View>
      <HoliSwipeable
        onSwipeLeft={deleteRoomItemHandler}
        swipeLeftConfirmation={{
          label: t('chat.actions.leave'),
          title: t('chat.actions.leave'),
          description: t('chat.actions.leave.confirmation.text'),
          confirmText: t('chat.actions.leave.confirmation.leave'),
          dismissText: t('chat.actions.leave.confirmation.cancel'),
        }}
        swipeLeftContent={<HoliIcon icon={Delete} color={colors.background10} />}
      >
        <View style={styles.backgroundWrapper}>
          <HoliBox padding={[0, paddingHorizontal ?? 0]}>
            <RoomItem room={room} {...props} />
          </HoliBox>
        </View>
      </HoliSwipeable>

      {isDeleting && <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.background20, opacity: 0.5 }]} />}
    </View>
  )
}

export default RoomItemDeletable

const styles = StyleSheet.create({
  backgroundWrapper: {
    backgroundColor: colors.background20,
  },
})
