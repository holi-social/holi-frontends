import * as React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { User } from '@holi/core/screens/userprofile/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliUserAvatar, { sizes as avatarSizes } from '@holi/ui/components/molecules/HoliUserAvatar'
import variables from '@holi/ui/styles/globalVars/variables'

interface HoliUserAvatarPileProps {
  users: User[]
  usersToShow?: number
  size?: 'micro' | 'small'
  collapse?: boolean
  counter?: boolean
}

const HoliUserAvatarPile: React.FC<HoliUserAvatarPileProps> = ({
  children,
  users,
  usersToShow = 5,
  size = 'micro',
  collapse = false,
  counter = false,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <View style={styles.container}>
        {users.slice(0, usersToShow).map((user, idx) => {
          const nameLabel = `${user.firstName || ''} ${user.lastName || ''}`.trim()
          const collapseDistance = collapse ? avatarSizes[size] / -2.4 : -4

          return (
            <HoliUserAvatar
              key={user.id}
              imageSrc={user.avatar}
              nameLabel={nameLabel || t('navigation.headerRight.avatarFallbackLabel')}
              initials={user.avatarLabel}
              defaultColor={user.avatarDefaultColor}
              size={size}
              style={[styles.avatar, { marginLeft: idx ? collapseDistance : 0, zIndex: idx * -1 }]}
            />
          )
        })}

        {(children || counter) && (
          <HoliText size="small" style={[styles.counter, styles.textGrey]}>
            {children || t('topics.contributors.discussing', { count: users.length })}
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
    borderColor: variables.white,
    borderWidth: 2,
  },
  textGrey: {
    color: variables.fontColorGrey,
  },
})
