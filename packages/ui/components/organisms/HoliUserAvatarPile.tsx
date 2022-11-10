import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { userFullName } from '@holi/core/helpers'
import { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliUserAvatar, { sizes as avatarSizes } from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

interface HoliUserAvatarPileProps {
  users: User[]
  usersToShow?: number
  size?: 'micro' | 'small'
  collapse?: boolean
  counter?: boolean
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
}

const HoliUserAvatarPile: React.FC<HoliUserAvatarPileProps> = ({
  children,
  users,
  usersToShow = 5,
  size = 'micro',
  collapse = false,
  counter = false,
  style,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <View style={[style, styles.container]}>
        {users.slice(0, usersToShow).map((user, idx) => {
          const nameLabel = userFullName(user)
          const collapseDistance = collapse ? avatarSizes[size] / -2.4 : -4

          return (
            <HoliUserAvatar
              key={`${user.id}-${Math.round(Math.random() * 100)}`}
              imageSrc={user.avatar}
              label={nameLabel || t('navigation.headerRight.avatarFallbackLabel')}
              initials={user.avatarLabel}
              defaultColor={user.avatarDefaultColor}
              size={size}
              style={[styles.avatar, { marginLeft: idx ? collapseDistance : 0, zIndex: idx * -1 }]}
              testID="pile-avatar"
            />
          )
        })}

        {(children || counter) && (
          <HoliText size="small" style={[styles.counter, styles.textGrey]}>
            {children || t('insights.editors.discussing', { count: users.length })}
          </HoliText>
        )}
      </View>
    </>
  )
}

export default HoliUserAvatarPile

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  counter: {
    marginLeft: 8,
  },
  avatar: {
    borderColor: colors.white,
    borderWidth: 2,
  },
  textGrey: {
    color: colors.fontColorGrey,
  },
})
