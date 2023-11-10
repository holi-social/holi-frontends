import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { ChaMembershipMessage } from '@holi/chat/src/store'
import { User } from '@holi/core/screens/userprofile/types'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import { colors } from '@holi/ui/styles/globalVars'

interface RoomMembershipBadgeProps {
  user?: User
  message: ChaMembershipMessage
  testID?: string
}

const RoomMembershipBadge = ({
  user,
  message: {
    content: { membership },
  },
  testID,
}: RoomMembershipBadgeProps) => {
  const { t } = useTranslation()

  // if Holi user wasn't found do not render the badge
  if (!user) return null

  return (
    <HoliBox padding={[8, 16]}>
      <View style={styles.rowWrapper}>
        <View
          testID={testID}
          style={[
            styles.wrapper,
            {
              backgroundColor: membership === 'join' ? colors.brandColorC10 : colors.background30,
              borderColor: membership === 'join' ? colors.foreground30 : colors.foreground10,
            },
          ]}
        >
          <HoliBox padding={[4, 8, 4, 4]}>
            <View style={styles.content}>
              <HoliBox padding={[0, 6, 0, 0]}>
                <HoliAvatar
                  imageSrc={user?.avatar}
                  imageBlurhash={user?.avatarBlurhash}
                  label={user?.fullName ?? ''}
                  initials={user?.avatarLabel ?? ''}
                  defaultColor={user?.avatarDefaultColor ?? ''}
                  size="micro"
                />
              </HoliBox>

              <HoliText>
                <HoliText size="small">
                  <Trans
                    t={t}
                    i18nKey={membership === 'join' ? 'chat.message.membership.join' : 'chat.message.membership.leave'}
                    values={{ user: user?.fullName }}
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

const styles = StyleSheet.create({
  wrapper: {
    borderColor: colors.foreground30,
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
