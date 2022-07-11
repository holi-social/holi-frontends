import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import HoliChip from '@holi/ui/components/HoliChip'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliReadMore from '@holi/ui/components/HoliReadMore'
import HoliText from '@holi/ui/components/HoliText'
import HoliUserAvatar from '@holi/ui/components/HoliUserAvatar'
import theme from '@holi/ui/styles/theme'

type UserProfileViewProps = {
  editUser: () => void
}

const UserProfileView: React.VoidFunctionComponent<UserProfileViewProps> = ({ editUser }) => {
  const { t } = useTranslation()

  //const { user } = useContext(UserContext)
  const user = {
    avatar: '',
    firstName: 'Steffen',
    middleName: 'J.',
    lastName: 'Brauer',
    aboutMe:
      'Hello, I am Steffen, more texttext more text more text more text more text more text more text more text more text more text more text more text more text more text more text more text more text more text more text more text text more text more text more text more text more text more text more text more text more text more texttext more text more text more text more text more text more text more text more text more text more texttext more text more text more text more text more text more text more text more text more text more texttext more text more text more text more text more text more text more text more text more text more texttext more text more text more text more text more text more text more text more text more text more text',
    pronouns: 'he/him',
    location: 'Hamburg, Germany',
    avatarDefaultColor: theme.colors.secondaryColor,
    avatarLabel: 'SB',
    engagementLevel: 'engaged',
    interests: ['this', 'that'],
    sdgs: ['this', 'that'],
    skills: ['this', 'that'],
  }

  if (!user) {
    return <HoliText>{t('user.profileView.noUser')}</HoliText>
  }

  return (
    <View style={styles.header}>
      <View style={styles.avatarName}>
        <View>
          <HoliUserAvatar
            imageSrc={user.avatar}
            nameLabel={user.firstName}
            initials={user.avatarLabel}
            defaultColor={user.avatarDefaultColor}
            size="large"
          />
        </View>
        <View style={styles.nameContainer}>
          <HoliHeading>{`${user.firstName} ${user.middleName} ${user.lastName}`}</HoliHeading>
          <HoliText styles={{ color: theme.colors.fontColorGrey }}>{`(${user.pronouns}) ${user.location}`}</HoliText>
        </View>
      </View>
      <HoliReadMore style={styles.aboutMe}>{user.aboutMe}</HoliReadMore>
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
