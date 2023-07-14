import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { getDisplayDate } from '@holi/core/i18n/helpers/dateHelper'
import { Message } from '@holi/core/screens/chat/components/seed'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import { colors } from '@holi/ui/styles/globalVars'

interface RoomMessageProps {
  message: Message
  showAvatar?: boolean
  isPrevMessageFromSameUser?: boolean
  isNextMessageFromSameUser?: boolean
  testID?: string
}

const RoomMessage = ({
  message,
  showAvatar = false,
  isPrevMessageFromSameUser = false,
  isNextMessageFromSameUser = false,
  testID,
}: RoomMessageProps) => {
  const { i18n } = useTranslation()

  const { user: me } = useLoggedInUser()
  // FIXME: currently Message has "user" prop type of "null" for me and "User" for all others
  const { user, text, postedAt } = message
  const messageUser = user ?? me!
  const isMyMessage = me === messageUser

  const paddingBottom = isNextMessageFromSameUser ? 2 : 8
  const paddingTop = isPrevMessageFromSameUser ? 2 : 8

  return (
    <HoliBox padding={[paddingTop, 16, paddingBottom, 16]}>
      <View
        style={[
          styles.rowWrapper,
          {
            justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
            flexDirection: isMyMessage ? 'row-reverse' : 'row',
          },
        ]}
      >
        {showAvatar ? (
          <HoliBox padding={isMyMessage ? [0, 0, 0, 8] : [0, 8, 0, 0]}>
            <HoliAvatar
              imageSrc={messageUser?.avatar}
              imageBlurhash={messageUser?.avatarBlurhash}
              label={messageUser?.fullName ?? ''}
              initials={messageUser?.avatarLabel ?? ''}
              defaultColor={messageUser?.avatarDefaultColor ?? ''}
              size="micro"
            />
          </HoliBox>
        ) : (
          <HoliBox padding={[0, 16]} />
        )}

        <View testID={testID} style={styles.wrapper}>
          <HoliBox padding={[4, 8, 8, 8]}>
            {!isMyMessage && !isPrevMessageFromSameUser && (
              <HoliBox padding={[0, 0, 4, 0]}>
                <HoliText bold>{messageUser.fullName}</HoliText>
              </HoliBox>
            )}

            <HoliText>{text}</HoliText>

            <View style={styles.date}>
              <HoliText size="extrasmall" color="gray300">
                {getDisplayDate(i18n.language, postedAt)}
              </HoliText>
            </View>
          </HoliBox>
        </View>
      </View>
    </HoliBox>
  )
}

export default RoomMessage

const styles = StyleSheet.create({
  wrapper: {
    borderColor: colors.background30,
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: colors.white100,
    flexShrink: 1,
  },
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  date: {
    alignItems: 'flex-end',
  },
})
