import React, { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { ChatRoomMember, ChatRoomMessage } from '@holi/chat/src/client/types'
import { isMsgMemberContent } from '@holi/chat/src/client/utils'
import { getChatInitials, getChatMemberName } from '@holi/chat/src/utils'
import type { User } from '@holi/core/domain/shared/types'
import { chatAdminUserId } from '@holi/core/helpers/config'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'

interface RoomMembershipBadgeProps {
  message: ChatRoomMessage
  member: ChatRoomMember | undefined
  user?: User
  testID?: string
}

const RoomMembershipBadge = ({ user, member, message, testID }: RoomMembershipBadgeProps) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const content = message.content

  if (!isMsgMemberContent(content)) return null
  if (member?.id == chatAdminUserId) return null
  const name = getChatMemberName(t, member?.name)

  return (
    <HoliBox padding={[8, 16]}>
      <View style={styles.rowWrapper}>
        <View
          testID={testID}
          style={[
            styles.wrapper,
            {
              backgroundColor: content.membership === 'join' ? colors.brandColorC10 : colors.background30,
              borderColor: content.membership === 'join' ? colors.foreground30 : colors.foreground10,
            },
          ]}
        >
          <HoliBox padding={[4, 8, 4, 4]}>
            <View style={styles.content}>
              <HoliBox padding={[0, 6, 0, 0]}>
                <Avatar
                  imgPlaceholder={user?.avatarBlurhash}
                  imgSrc={member?.avatar}
                  label={name}
                  initials={getChatInitials(member?.name)}
                  size="xs"
                />
              </HoliBox>

              <HoliText>
                <HoliText size="small">
                  <Trans
                    t={t}
                    i18nKey={
                      content.membership === 'join' ? 'chat.message.membership.join' : 'chat.message.membership.leave'
                    }
                    values={{ user: name }}
                  >
                    <HoliText size="small" italic />
                  </Trans>
                </HoliText>
              </HoliText>
            </View>
          </HoliBox>
        </View>
      </View>
    </HoliBox>
  )
}

export default RoomMembershipBadge

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    wrapper: {
      borderColor: theme.colors.foreground30,
      borderWidth: 1,
      borderRadius: 12,
      flexShrink: 1,
    },
    rowWrapper: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    content: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    date: {
      alignItems: 'flex-end',
    },
  })
