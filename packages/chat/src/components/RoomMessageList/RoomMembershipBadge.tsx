import React, { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { ChatRoomMember, ChatRoomMessage } from '@holi/chat/src/client/types'
import { isMsgMemberContent } from '@holi/chat/src/client/utils'
import type { User } from '@holi/core/screens/userprofile/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
                {user ? (
                  <HoliAvatar
                    imageSrc={member?.avatar}
                    imageBlurhash={user?.avatarBlurhash}
                    label={user?.fullName ?? ''}
                    initials={user?.avatarLabel ?? ''}
                    defaultColor={user?.avatarDefaultColor ?? ''}
                    size="micro"
                  />
                ) : (
                  <HoliAvatar
                    label={t('chat.user.deleted')}
                    initials=":/"
                    defaultColor={colors.brandColorD20}
                    initialsColor="foreground30at48Percent"
                    initialsFontWeight="500"
                    size="micro"
                  />
                )}
              </HoliBox>

              <HoliText>
                <HoliText size="small">
                  <Trans
                    t={t}
                    i18nKey={
                      content.membership === 'join' ? 'chat.message.membership.join' : 'chat.message.membership.leave'
                    }
                    values={{ user: user ? user?.fullName : t('chat.user.deleted') }}
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
