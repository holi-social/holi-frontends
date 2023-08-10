import { useAtomValue, useSetAtom } from 'jotai'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { ChatRoomAtom, selectRoomByIdAtom } from '@holi/chat/src/store'
import { getDisplayDate } from '@holi/core/i18n/helpers/dateHelper'
import { User } from '@holi/core/screens/userprofile/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import { colors } from '@holi/ui/styles/globalVars'

interface RoomItemProps {
  roomAtom: ChatRoomAtom
  user?: User
  loading?: boolean
  testID?: string
}

// nummeric constants to use for ItemLayout in FlatList
export const ROOM_ITEM_CONTENT_HEIGHT = 52
export const ROOM_ITEM_VERTICAL_PADDING = 16
export const ROOM_ITEM_HEIGHT = ROOM_ITEM_CONTENT_HEIGHT + ROOM_ITEM_VERTICAL_PADDING * 2

const RoomItem = ({ roomAtom, user, testID, loading }: RoomItemProps) => {
  const { i18n } = useTranslation()
  const { id: roomId, name, notificationCount, lastMessage, timestamp } = useAtomValue(roomAtom)
  const selectRoomById = useSetAtom(selectRoomByIdAtom)

  const hasUnseenMessages = notificationCount > 0

  if (loading) {
    return (
      <HoliBox padding={[ROOM_ITEM_VERTICAL_PADDING, 0]}>
        <View testID={testID} style={styles.rowWrapper}>
          <View>
            <HoliAvatar size="medium" loading />
          </View>

          <View style={styles.content}>
            <View style={[styles.rowWrapper, styles.nameDateRaw]}>
              <View style={{ flex: 1 }}>
                <HoliText bold loading />
              </View>
            </View>

            <HoliText skeletonOptions={{ width: '100%' }} loading />
          </View>
        </View>
      </HoliBox>
    )
  }

  return (
    <HoliLink href={`/chat/rooms/${roomId}`} label={user?.fullName ?? ''} onPress={() => selectRoomById(roomId)}>
      <HoliBox padding={[ROOM_ITEM_VERTICAL_PADDING, 0]}>
        <View testID={testID} style={styles.rowWrapper}>
          {/* View bellow is used to position message indicator regarding the HoliAvatar */}
          <View>
            {user !== null ? (
              <HoliAvatar
                imageSrc={user?.avatar}
                imageBlurhash={user?.avatarBlurhash}
                label={name}
                initials={user?.avatarLabel || ''}
                defaultColor={user?.avatarDefaultColor || ''}
                size="medium"
              />
            ) : null}

            {hasUnseenMessages && (
              <View style={styles.unseenMessageIndicator}>
                <HoliText size="extrasmall" bold color="white100">
                  {notificationCount > 99 ? '∞' : notificationCount}
                </HoliText>
              </View>
            )}
          </View>

          <View style={styles.content}>
            <View style={[styles.rowWrapper, styles.nameDateRaw]}>
              <View style={{ flexShrink: 1 }}>
                <HoliText bold>{user?.fullName}</HoliText>
              </View>

              {!!timestamp && (
                <HoliText size="small" color={hasUnseenMessages ? 'brandB300' : 'gray300'}>
                  {getDisplayDate(i18n.language, timestamp)}
                </HoliText>
              )}
            </View>

            {lastMessage && (
              <HoliText numberOfLines={1} color="gray300">
                {lastMessage.content.body}
              </HoliText>
            )}
          </View>
        </View>
      </HoliBox>
    </HoliLink>
  )
}

export default memo(RoomItem)

const styles = StyleSheet.create({
  rowWrapper: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: '100%',
    gap: 4,
  },
  unseenMessageIndicator: {
    borderWidth: 2,
    borderColor: colors.white100,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.brandColorB30,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  nameDateRaw: {
    justifyContent: 'space-between',
  },
  name: {
    flexShrink: 1,
  },
  fontColorGray: {
    color: colors.foreground20,
  },
})
