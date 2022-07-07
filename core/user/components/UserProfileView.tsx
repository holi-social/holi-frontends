import React, { useContext } from 'react'
import { StyleSheet, View } from 'react-native'

import { UserContext } from '@holi/core/user/UserContextProvider'
import HoliChip from '@holi/ui/components/HoliChip'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliText from '@holi/ui/components/HoliText'
import HoliUserAvatar from '@holi/ui/components/HoliUserAvatar'
import theme from '@holi/ui/styles/theme'

type UserProfileViewProps = {
  editUser: () => void
}

const UserProfileView: React.VoidFunctionComponent<UserProfileViewProps> = ({ editUser }) => {
  //const { user } = useContext(UserContext)
  const user = {
    avatar: '',
    firstName: 'Steffen Steffen Steffen',
    middleName: 'J. asfasf asdfasdf',
    lastName: 'Brauer Brauer Brauer',
    aboutMe:
      'Hello, I am Steffen, more text more text more text more text more text more text more text more text more text more text more text more text more text',
    pronouns: 'he/him',
    location: 'Hamburg Hamburg Hamburg, Deutschland, Welt, Milchstraße aweiorhaw hioaweriowahr aiowheroiwahre',
    avatarDefaultColor: theme.colors.secondaryColor,
    avatarLabel: 'SB',
    engagementLevel: 'engaged',
    interests: ['this', 'that'],
    sdgs: ['this', 'that'],
    skills: ['this', 'that'],
  }

  if (!user) {
    return <HoliText>No user fetched</HoliText>
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
      <HoliText styles={styles.aboutMe}>{user.aboutMe}</HoliText>
      <View style={{ flexDirection: 'row', marginTop: 16 }}>
        <HoliChip
          text="Connect"
          label="connect"
          checked={false}
          disabled={false}
          style={{ marginRight: 8 }}
          fontStyle={{ color: theme.colors.positivepurple }}
        ></HoliChip>
        <HoliChip
          text="Message"
          label="connect"
          checked={false}
          disabled={true}
          fontStyle={{ color: theme.colors.positivepurple }}
        ></HoliChip>
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
    color: theme.colors.fontColorGrey,
  },
})

export { UserProfileView }
