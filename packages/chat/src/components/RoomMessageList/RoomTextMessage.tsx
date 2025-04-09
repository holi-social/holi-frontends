import { useAtomValue } from 'jotai'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'

import type { ChatRoomMember, ChatRoomMessage } from '@holi/chat/src/client/types'
import { isMsgTextContent } from '@holi/chat/src/client/utils'
import { loggedInMemberIdAtom } from '@holi/chat/src/store'
import { getChatInitials, getChatMemberName } from '@holi/chat/src/utils'
import { getTimeFormat } from '@holi/core/i18n/helpers/dateHelper'
import { getLocale } from '@holi/core/i18n/helpers/dateHelper'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliRichTextOutput from '@holi/ui/components/organisms/HoliRichTextOutput'
import { Avatar } from 'holi-bricks/components/avatar'
import type { User } from '@holi/core/domain/shared/types'
import { createStyleSheet } from 'holi-bricks/utils'
import { useStyles } from 'holi-bricks/hooks'
import { BorderRadius } from 'holi-bricks/tokens'
import { Text } from 'holi-bricks/components/text'

interface Props {
  message: ChatRoomMessage
  member: ChatRoomMember | undefined
  holiUser?: User
  showAvatar?: boolean
  isPrevMessageFromSameUser?: boolean
  isNextMessageFromSameUser?: boolean
  testID?: string
  isSender?: boolean
}

const RoomTextMessage = ({
  message,
  member,
  holiUser,
  showAvatar = false,
  isPrevMessageFromSameUser = false,
  isNextMessageFromSameUser = false,
  isSender,
  testID,
}: Props) => {
  const { i18n, t } = useTranslation()
  const locale = getLocale(i18n.language)
  const { styles } = useStyles(stylesheet)

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
            <Avatar
              source={member?.avatar}
              imgPlaceholder={holiUser?.avatarBlurhash}
              label={getChatMemberName(t, member?.name)}
              initials={getChatInitials(member?.name)}
              size="xs"
            />
          </HoliBox>
        ) : (
          <HoliBox padding={[0, 16]} />
        )}

        <View testID={testID} style={styles.wrapper(isSender)}>
          <HoliBox padding={[4, 8, 8, 8]}>
            {!isMyMessage && !isPrevMessageFromSameUser && (
              <HoliBox padding={[0, 0, 4, 0]}>
                <Text size="sm" color="support">
                  {getChatMemberName(t, member?.name)}
                </Text>
              </HoliBox>
            )}

            {content.body ? (
              <HoliRichTextOutput size="md" text={content.body} allowAllLinks />
            ) : (
              <Text size="md">{t('chat.message.deleted')}</Text>
            )}

            <View style={styles.date}>
              <Text size="xs" color={'default'}>
                {getTimeFormat(locale, timestamp)}
              </Text>
            </View>
          </HoliBox>
        </View>
      </View>
    </HoliBox>
  )
}

export default RoomTextMessage

const stylesheet = createStyleSheet((theme) => ({
  wrapper: (isSender?: boolean) => ({
    borderColor: isSender ? theme.colors.decorative.purpleLight : theme.colors.bg.support,
    borderWidth: 1,
    borderRadius: BorderRadius.sm,
    backgroundColor: isSender ? theme.colors.decorative.purpleLight : theme.colors.bg.support,
    flexShrink: 1,
  }),
  rowWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
  },
  date: {
    alignItems: 'flex-end',
  },
}))
