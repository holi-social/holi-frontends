import React, { useContext } from 'react'
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
    pronouns: user.pronouns || patch.pronouns,
    location: user.location || patch.location,
    aboutMe: user.aboutMe || patch.aboutMe,
    avatarDefaultColor: user.avatarDefaultColor || patch.avatarDefaultColor,
    avatarLabel: user.avatarLabel || patch.avatarLabel,
    engagementLevel: user.engagementLevel || patch.engagementLevel,
    interests: user.interests || patch.interests,
    sdgs: user.sdgs || patch.sdgs,
    skills: user.skills || patch.skills,
  }
}

const UserProfileView: React.VFC = () => {
  let { user } = useContext(UserContext)

  if (!user) {
    return <HoliText>No user fetched</HoliText>
  }

  user = userWorkaroundUntilHoli1421(user)

  const fullName = `${user.firstName ? user.firstName : ''}${user.lastName && user.firstName ? ' ' : ''}${
    user.lastName ? user.lastName : ''
  }`

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
          text="Connect"
          label="connect"
          checked={false}
          disabled={false}
          style={{ marginRight: 8 }}
          fontStyle={{ color: theme.colors.positivepurple }}
        />
        <HoliChip
          text="Message"
          label="connect"
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
