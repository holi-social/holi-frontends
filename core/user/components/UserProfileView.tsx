import HoliChip from '@holi/ui/components/HoliChip'
import theme from '@holi/ui/styles/theme'
import React, { useContext } from 'react'
import { StyleSheet, View } from 'react-native'

import { UserContext } from '@holi/core/user/UserContextProvider'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'
import HoliUserAvatar from '@holi/ui/components/HoliUserAvatar'

type UserProfileViewProps = {
  editUser: () => void
}

const UserProfileView: React.VoidFunctionComponent<UserProfileViewProps> = ({ editUser }) => {
  //const { user } = useContext(UserContext)
  const user = {
    avatar: '',
    firstName: 'Steffen',
    middleName: 'J.',
    lastName: 'Brauer',
    aboutMe:
      'Hello, I am Steffen, more text more text more text more text more text more text more text more text more text more text more text more text more text',
    pronouns: 'he/him',
    location: 'Hamburg, Deutschland',
    avatarDefaultColor: 'blue',
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
    <>
      {
        <View style={styles.profileHeader}>
          <View style={styles.profileAvatarName}>
            <View>
              <HoliUserAvatar
                imageSrc={user.avatar}
                nameLabel={user.avatarLabel}
                defaultColor={user.avatarDefaultColor}
                size="large"
              />
            </View>
            <View style={styles.profileNamePronounsLocation}>
              <HoliText type={HoliTextType.heading2}>{`${user.firstName} ${user.lastName} ${user.lastName}`}</HoliText>
              <HoliText type={HoliTextType.body}>
                ({user.pronouns}) {user.location}
              </HoliText>
            </View>
          </View>
          <HoliText styles={{ marginTop: 16 }}>{user.aboutMe}</HoliText>
          <View style={{flexDirection: 'row', marginTop: 16}}>
            <HoliChip
              text="Connect"
              label="connect"
              checked={false}
              disabled={false}
              style={{marginRight: 8}}
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
      }
      <HoliText>{user.engagementLevel}</HoliText>
      <HoliText>{user.interests.join(', ')}</HoliText>
      <HoliText>{user.sdgs.join(', ')}</HoliText>
      <HoliText>{user.skills.join(', ')}</HoliText>
      <HoliButton label="Profile data" onPress={editUser}>
        Edit
      </HoliButton>
    </>
  )
}

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: 'column',
  },
  profileAvatarName: {
    flexDirection: 'row',
  },
  profileNamePronounsLocation: {
    marginLeft: 16,
  },
})

export { UserProfileView }
