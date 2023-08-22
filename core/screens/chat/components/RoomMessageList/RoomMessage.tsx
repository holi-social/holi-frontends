import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { ChatMessage } from '@holi/chat/src/store'
import { getTimeFormat } from '@holi/core/i18n/helpers/dateHelper'
import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import { User } from '@holi/core/screens/userprofile/types'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import { colors } from '@holi/ui/styles/globalVars'

interface RoomMessageProps {
  message: ChatMessage
  user?: User
  showAvatar?: boolean
  isPrevMessageFromSameUser?: boolean
  isNextMessageFromSameUser?: boolean
  testID?: string
}

const RoomMessage = ({
  message,
  user,
  showAvatar = false,
  isPrevMessageFromSameUser = false,
  isNextMessageFromSameUser = false,
  testID,
}: RoomMessageProps) => {
  const { i18n } = useTranslation()

  const locale = getLocale(i18n.language)

  const { user: me } = useLoggedInUser()
  const isMyMessage = !!(me || user) && me?.id === user?.id

  const { content, timestamp } = message

  const paddingBottom = isNextMessageFromSameUser ? 2 : 8
  const paddingTop = isPrevMessageFromSameUser ? 2 : 8

  return (
    <HoliBox padding={[paddingTop, 16, paddingBottom, 16]}>
      <View style={[styles.rowWrapper, { flexDirection: isMyMessage ? 'row-reverse' : 'row' }]}>
        {showAvatar ? (
          <HoliBox padding={isMyMessage ? [0, 0, 0, 8] : [0, 8, 0, 0]}>
            <HoliAvatar
              imageSrc={user?.avatar}
              imageBlurhash={user?.avatarBlurhash}
              label={user?.fullName ?? ''}
              initials={user?.avatarLabel ?? ''}
              defaultColor={user?.avatarDefaultColor ?? ''}
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
                <HoliText bold>{user?.fullName}</HoliText>
              </HoliBox>
            )}

            <HoliText>{content.body}</HoliText>

            <View style={styles.date}>
              <HoliText size="extrasmall" color="gray300">
                {getTimeFormat(locale, timestamp)}
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
    justifyContent: 'flex-start',
  },
  date: {
    alignItems: 'flex-end',
  },
})
