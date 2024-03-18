import { useAtomValue } from 'jotai'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { ChatRoomMember, ChatRoomMessage } from '@holi/chat/src/client/types'
import { isMsgTextContent } from '@holi/chat/src/client/utils'
import { loggedInMemberIdAtom } from '@holi/chat/src/store'
import { getTimeFormat } from '@holi/core/i18n/helpers/dateHelper'
import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import { User } from '@holi/core/screens/userprofile/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface Props {
  message: ChatRoomMessage
  member: ChatRoomMember | undefined
  holiUser?: User
  showAvatar?: boolean
  isPrevMessageFromSameUser?: boolean
  isNextMessageFromSameUser?: boolean
  testID?: string
}

const RoomTextMessage = ({
  message,
  member,
  holiUser,
  showAvatar = false,
  isPrevMessageFromSameUser = false,
  isNextMessageFromSameUser = false,
  testID,
}: Props) => {
  const { i18n, t } = useTranslation()
  const locale = getLocale(i18n.language)
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const myId = useAtomValue(loggedInMemberIdAtom)
  const isMyMessage = message.sender === myId

  const { content, timestamp } = message

  if (!isMsgTextContent(content)) return null

  const paddingBottom = isNextMessageFromSameUser ? 2 : 8
  const paddingTop = isPrevMessageFromSameUser ? 2 : 8

  return (
    <HoliBox padding={[paddingTop, 16, paddingBottom, 16]}>
      <View style={[styles.rowWrapper, { flexDirection: isMyMessage ? 'row-reverse' : 'row' }]}>
        {showAvatar ? (
          <HoliBox padding={isMyMessage ? [0, 0, 0, 8] : [0, 8, 0, 0]}>
            {holiUser ? (
              <HoliAvatar
                imageSrc={member?.avatar}
                imageBlurhash={holiUser?.avatarBlurhash}
                label={holiUser?.fullName ?? ''}
                initials={holiUser?.avatarLabel ?? ''}
                defaultColor={holiUser?.avatarDefaultColor ?? ''}
                size="micro"
              />
            ) : (
              <HoliAvatar
                label={t('chat.user.deleted')}
                initials=":/"
                defaultColor={colors.brandColorD20}
                size="micro"
              />
            )}
          </HoliBox>
        ) : (
          <HoliBox padding={[0, 16]} />
        )}

        <View testID={testID} style={styles.wrapper}>
          <HoliBox padding={[4, 8, 8, 8]}>
            {!isMyMessage && !isPrevMessageFromSameUser && (
              <HoliBox padding={[0, 0, 4, 0]}>
                <HoliText bold>{holiUser?.fullName}</HoliText>
              </HoliBox>
            )}

            {content.body ? (
              <HoliRichTextOutput text={content.body} allowAllLinks />
            ) : (
              <HoliText>{t('chat.message.deleted')}</HoliText>
            )}

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

export default RoomTextMessage

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      borderColor: theme.colors.background30,
      borderWidth: 1,
      borderRadius: 12,
      backgroundColor: theme.colors.white100,
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
