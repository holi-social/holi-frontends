import { useAtomValue } from 'jotai'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { ChatRoomAtom, setLatestMessagesAsRead } from '@holi/chat/src/store'
import { getDisplayDate } from '@holi/core/i18n/helpers/dateHelper'
import { getChatPartner, useMatrixIdToHoliUserRecord } from '@holi/core/screens/chat/components/RoomList/helpers'
import { User } from '@holi/core/screens/userprofile/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import { colors } from '@holi/ui/styles/globalVars'

interface RoomItemProps {
  roomAtom: ChatRoomAtom
  loggedInUser: User // optimization to not re-fetch the logged in user on scrolling
  testID?: string
}

// nummeric constants to use for ItemLayout in FlatList
export const ROOM_ITEM_CONTENT_HEIGHT = 52
export const ROOM_ITEM_VERTICAL_PADDING = 16
export const ROOM_ITEM_HEIGHT = ROOM_ITEM_CONTENT_HEIGHT + ROOM_ITEM_VERTICAL_PADDING * 2

const RoomItem = ({ roomAtom, loggedInUser, testID }: RoomItemProps) => {
  const { i18n, t } = useTranslation()
  const room = useAtomValue(roomAtom)
  const { matrixIdToHoliUserRecord, loading } = useMatrixIdToHoliUserRecord(room.members.map((m) => m.id))
  const chatPartner = getChatPartner(loggedInUser, room)
  const chatPartnerHoliUser = chatPartner && matrixIdToHoliUserRecord[chatPartner.id]
  const { id: roomId, name, hasInvitation, notificationCount, lastMessage, timestamp } = room
  const hasUnseenMessages = notificationCount > 0

  const handleOnPress = async () => {
    await setLatestMessagesAsRead(roomId)
  }

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
    <HoliLink href={`/chat/rooms/${roomId}`} label={chatPartnerHoliUser?.fullName ?? ''} onPress={handleOnPress}>
      <HoliBox padding={[ROOM_ITEM_VERTICAL_PADDING, 0]}>
        <View testID={testID} style={styles.rowWrapper}>
          {/* View bellow is used to position message indicator regarding the HoliAvatar */}
          <View>
            {chatPartnerHoliUser !== null ? (
              <HoliAvatar
                imageSrc={chatPartnerHoliUser?.avatar}
                imageBlurhash={chatPartnerHoliUser?.avatarBlurhash}
                label={name}
                initials={chatPartnerHoliUser?.avatarLabel || ''}
                defaultColor={chatPartnerHoliUser?.avatarDefaultColor || ''}
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
                <HoliText bold>{chatPartnerHoliUser?.fullName}</HoliText>
              </View>

              {!!timestamp && (
                <HoliText size="small" color={hasUnseenMessages ? 'brandB300' : 'gray300'}>
                  {getDisplayDate(i18n.language, timestamp)}
                </HoliText>
              )}
            </View>

            {hasInvitation && (
              <HoliText numberOfLines={1} color="brandB300">
                {t('chat.invitation.newconversation')}
              </HoliText>
            )}
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
