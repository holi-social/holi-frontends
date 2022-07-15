import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { UserContext } from '@holi/core/user/UserContextProvider'
import { User } from '@holi/core/user/types'
import HoliChip from '@holi/ui/components/HoliChip'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliReadMore from '@holi/ui/components/HoliReadMore'
import HoliText from '@holi/ui/components/HoliText'
import HoliUserAvatar from '@holi/ui/components/HoliUserAvatar'
import theme from '@holi/ui/styles/theme'

// TODO HOLI-1813: remove after nullable fields are properly handled
const userWorkaroundUntilHoli1421 = (user: User): User => {
  console.info('user', user)
  const patch: User = {
    id: '123',
    avatar: '',
    firstName: 'Steffen',
    lastName: 'Brauer',
    aboutMe:
      'Hello, I am Steffen, more texttext more text more text more text more text more text more text more text more text more text more text more text more text more text more text more text more text more text more text more text text more text more text more text more text more text more text more text more text more text more texttext more text more text more text more text more text more text more text more text more text more texttext more text more text more text more text more text more text more text more text more text more texttext more text more text more text more text more text more text more text more text more text more texttext more text more text more text more text more text more text more text more text more text more text',
    pronouns: 'he/him',
    location: 'Hamburg, Germany',
    avatarDefaultColor: theme.colors.secondaryColor,
    avatarLabel: 'SB',
    engagementLevel: 'engaged',
    interests: ['interest1', 'interest2'],
    sdgs: ['sdg1', 'sdg1'],
    skills: ['skill1', 'skill2'],
  }
  return {
    id: user.id || patch.id,
    avatar: user.avatar || patch.avatar,
    firstName: user.firstName || patch.firstName,
    lastName: user.lastName || patch.lastName,
    aboutMe: user.aboutMe || patch.aboutMe,
    pronouns: user.pronouns || patch.pronouns,
    location: user.location || patch.location,
    avatarDefaultColor: user.avatarDefaultColor || patch.avatarDefaultColor,
    avatarLabel: user.avatarLabel || patch.avatarLabel,
    engagementLevel: user.engagementLevel || patch.engagementLevel,
    interests: user.interests || patch.interests,
    sdgs: user.sdgs || patch.sdgs,
    skills: user.skills || patch.skills,
  }
}

const UserProfileView: React.VFC = () => {
  const { t } = useTranslation()

  let { user } = useContext(UserContext)

  if (!user) {
    return <HoliText>{t('user.profileView.noUser')}</HoliText>
  }

  user = userWorkaroundUntilHoli1421(user)

  // TODO HOLI-1813 properly handle nullable fields
  return (
    <View style={styles.header}>
      <View style={styles.avatarName}>
        <View>
          <HoliUserAvatar
            imageSrc={user.avatar}
            nameLabel={user.firstName || ''} // TODO HOLI-1813 properly handle nullable field
            initials={user.avatarLabel || ''} // TODO HOLI-1813 properly handle nullable field
            defaultColor={user.avatarDefaultColor || '#FFAE86'} // TODO HOLI-1813 properly handle nullable field
            size="large"
          />
        </View>
        <View style={styles.nameContainer}>
          <HoliHeading>{`${user.firstName} ${user.lastName}`}</HoliHeading>
          <HoliText style={{ color: theme.colors.fontColorGrey }}>{`(${user.pronouns}) ${user.location}`}</HoliText>
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
    width: '100%',
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
