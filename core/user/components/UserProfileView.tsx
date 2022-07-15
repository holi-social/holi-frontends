import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { UserContext } from '@holi/core/user/UserContextProvider'
import HoliChip from '@holi/ui/components/HoliChip'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliReadMore from '@holi/ui/components/HoliReadMore'
import HoliText from '@holi/ui/components/HoliText'
import HoliUserAvatar from '@holi/ui/components/HoliUserAvatar'
import theme from '@holi/ui/styles/theme'

const UserProfileView: React.VFC = () => {
  const { t } = useTranslation()

  const { user } = useContext(UserContext)

  if (!user) {
    return <HoliText>{t('user.profileView.noUser')}</HoliText>
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim()

  return (
    <View style={styles.header}>
      <View style={styles.avatarName}>
        <View>
          <HoliUserAvatar
            imageSrc={user.avatar}
            nameLabel={fullName}
            initials={user.avatarLabel}
            defaultColor={user.avatarDefaultColor}
            size="large"
          />
        </View>
        <View style={styles.nameContainer}>
          <HoliHeading>{fullName}</HoliHeading>
          <HoliText styles={{ color: theme.colors.fontColorGrey }}>
            {user.pronouns && `(${user.pronouns}) `}
            {user.location && `${user.location}`}
          </HoliText>
        </View>
      </View>
      {user.aboutMe && <HoliReadMore style={styles.aboutMe}>{user.aboutMe}</HoliReadMore>}
      <View style={{ flexDirection: 'row', marginTop: 16 }}>
        <HoliChip
          text={t('user.profileView.connect')}
          label={t('user.profileView.connect')}
          checked={false}
          disabled={false}
          style={{ marginRight: 8 }}
          fontStyle={{ color: theme.colors.positivepurple }}
        />
        <HoliChip
          text={t('user.profileView.message')}
          label={t('user.profileView.message')}
          checked={false}
          disabled={true}
          fontStyle={{ color: theme.colors.positivepurple }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    minWidth: 250,
  },
  avatarName: {
    flexDirection: 'row',
  },
  nameContainer: {
    marginTop: 8,
    marginLeft: 16,
    flexShrink: 1,
    flex: 1,
  },
  aboutMe: {
    marginTop: 16,
  },
})

export { UserProfileView }
