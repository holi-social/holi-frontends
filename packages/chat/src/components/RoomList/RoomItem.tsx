import { useAtomValue } from 'jotai'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { ChatRoom, ChatRoomMessage } from '@holi/chat/src/client/types'
import { isMsgMemberContent, isMsgTextContent } from '@holi/chat/src/client/utils'
import { chatPartnerAtomCreator, setLatestMessagesAsRead, useLastRoomMessage } from '@holi/chat/src/store'
import { isSpaceChildChatRoom } from '@holi/chat/src/store/utils'
import { getChatInitials, getChatMemberName, isMatrixId } from '@holi/chat/src/utils'
import type { User } from '@holi/core/domain/shared/types'
import { getInitials } from '@holi/core/helpers'
import { getDisplayDate } from '@holi/core/i18n/helpers/dateHelper'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'

interface RoomItemProps {
  room: ChatRoom
  loggedInUser: User // optimization to not re-fetch the logged in user on scrolling
}

// nummeric constants to use for ItemLayout in FlatList
export const ROOM_ITEM_CONTENT_HEIGHT = 52
export const ROOM_ITEM_VERTICAL_PADDING = 16
export const ROOM_ITEM_HEIGHT = ROOM_ITEM_CONTENT_HEIGHT + ROOM_ITEM_VERTICAL_PADDING * 2

const RoomItem = ({ room, loggedInUser }: RoomItemProps) => {
  const { i18n, t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { id: roomId, name, hasInvitation, notificationCount, members } = room
  const chatPartner = useAtomValue(useMemo(() => chatPartnerAtomCreator(roomId, loggedInUser), [loggedInUser, roomId]))

  const hasUnseenMessages = notificationCount > 0
  const testID = `room-item-${name}`
  const isSpaceRoom = isSpaceChildChatRoom(room)
  const roomName = isSpaceRoom ? room.content.spaceName : room.name

  const lastMessage = useLastRoomMessage(room)

  const handleOnPress = async () => {
    await setLatestMessagesAsRead(roomId)
  }

  const getChatMessage = (message: ChatRoomMessage, isSpaceRoom = false): string | null => {
    if (isMsgTextContent(message.content)) {
      if (isSpaceRoom) {
        return members.find((m) => m.id == message.sender)?.name + ': ' + (message.content.body ?? '')
      }
      return message.content.body ?? ''
    }

    if (isMsgMemberContent(message.content)) {
      switch (message.content.membership) {
        case 'join':
          return t('chat.room.lastMessage.membership.join', { user: getChatMemberName(t, message.content.name) })
        case 'leave':
          return t('chat.room.lastMessage.membership.leave', { user: getChatMemberName(t, message.content.name) })
        default:
          return null
      }
    }

    return null
  }

  return (
    <HoliLink href={`/chat/rooms/${roomId}`} label={roomName} onPress={handleOnPress}>
      <HoliBox padding={[ROOM_ITEM_VERTICAL_PADDING, 0]}>
        <View testID={testID} style={styles.rowWrapper}>
          {/* View below is used to position message indicator regarding the HoliAvatar */}
          <View>
            {isSpaceRoom ? (
              <Avatar
                label={roomName}
                initials={getInitials(room.content.spaceName)}
                imgSrc={room.avatar}
                shape="square"
                size="md"
              />
            ) : chatPartner ? (
              isMatrixId(chatPartner.name) ? (
                <Avatar
                  label={roomName}
                  imgSrc={chatPartner.avatar ?? ''}
                  initials={getChatInitials(chatPartner.name)}
                  size="md"
                />
              ) : (
                <Avatar
                  label={roomName}
                  imgSrc={chatPartner.avatar ?? ''}
                  initials={getChatInitials(chatPartner.name)}
                  size="md"
                />
              )
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
                <HoliText bold>{roomName}</HoliText>
              </View>

              {!!lastMessage?.timestamp && (
                <HoliText size="small" color={hasUnseenMessages ? 'brandB300' : 'gray300'}>
                  {getDisplayDate(i18n.language, lastMessage.timestamp)}
                </HoliText>
              )}
            </View>

            {hasInvitation ? (
              <HoliText numberOfLines={1} color="brandB300">
                {t('chat.invitation.newconversation')}
              </HoliText>
            ) : lastMessage ? (
              <HoliText numberOfLines={1} color="gray300">
                {getChatMessage(lastMessage, isSpaceRoom)}
              </HoliText>
            ) : (
              <HoliText numberOfLines={1} color="gray300">
                {t('chat.room.noMessages')}
              </HoliText>
            )}
          </View>
        </View>
      </HoliBox>
    </HoliLink>
  )
}

export default memo(RoomItem)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
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
      borderColor: theme.colors.white100,
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: theme.colors.brandColorB30,
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
      color: theme.colors.foreground20,
    },
  })
