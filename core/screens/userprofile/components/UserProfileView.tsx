import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliChip from '@holi/ui/components/molecules/HoliChip'
import HoliReadMore from '@holi/ui/components/molecules/HoliReadMore'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

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
          <HoliHeading testID="user-profile-full-name">{fullName}</HoliHeading>
          <HoliText style={{ color: colors.fontColorGrey }}>
            {user.pronouns && `(${user.pronouns}) `}
            {user.location && `${user.location}`}
          </HoliText>
        </View>
      </View>
      {user.aboutMe && <HoliReadMore style={styles.aboutMe}>{user.aboutMe}</HoliReadMore>}
      <View style={{ flexDirection: 'row', marginTop: 16 }}>
        <HoliChip
          text={t('user.profileView.connect')}
          checked={false}
          disabled={false}
          style={{ marginRight: 8 }}
          fontStyle={{ color: colors.positivepurple }}
        />
        <HoliChip
          text={t('user.profileView.message')}
          checked={false}
          disabled={true}
          fontStyle={{ color: colors.positivepurple }}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'column',
    width: '100%',
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

export default UserProfileView
