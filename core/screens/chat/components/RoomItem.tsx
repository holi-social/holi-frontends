import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { getDisplayDate } from '@holi/core/i18n/helpers/dateHelper'
import { Conversation } from '@holi/core/screens/chat/components/seed'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import { colors } from '@holi/ui/styles/globalVars'

interface RoomItemProps {
  room: Conversation
  testID?: string
}

// nummeric constants to use for ItemLayout in FlatList
export const ROOM_ITEM_CONTENT_HEIGHT = 52
export const ROOM_ITEM_VERTICAL_PADDING = 16
export const ROOM_ITEM_HEIGHT = ROOM_ITEM_CONTENT_HEIGHT + ROOM_ITEM_VERTICAL_PADDING * 2

const RoomItem = ({ room, testID }: RoomItemProps) => {
  const { t, i18n } = useTranslation()
  const { user, lastMessage, unseenMessageCount } = room
  const userFullName = user.fullName || t('user.profileView.anonymous')
  const hasUnseenMessages = unseenMessageCount > 0

  return (
    <View testID={testID} style={styles.rowWrapper}>
      {/* View bellow is used to position message indicator regarding the HoliAvatar */}
      <View>
        <HoliAvatar
          imageSrc={user.avatar}
          imageBlurhash={user.avatarBlurhash}
          label={userFullName}
          initials={user.avatarLabel || ''}
          defaultColor={user.avatarDefaultColor || ''}
          size="medium"
        />

        {hasUnseenMessages && (
          <View style={styles.unseenMessageIndicator}>
            <HoliText size="extrasmall" bold color="white100">
              {unseenMessageCount > 99 ? '∞' : unseenMessageCount}
            </HoliText>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={[styles.rowWrapper, styles.nameDateRaw]}>
          <View style={{ flexShrink: 1 }}>
            <HoliText bold>{userFullName}</HoliText>
          </View>

          <HoliText size="small" color={hasUnseenMessages ? 'brandB300' : 'gray300'}>
            {getDisplayDate(i18n.language, lastMessage.postedAt)}
          </HoliText>
        </View>

        <HoliText numberOfLines={1} style={styles.fontColorGray}>
          {lastMessage.text}
        </HoliText>
      </View>
    </View>
  )
}

export default RoomItem

const styles = StyleSheet.create({
  rowWrapper: {
    display: 'flex',
    flexDirection: 'row',
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
