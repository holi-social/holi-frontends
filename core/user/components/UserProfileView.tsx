import React, { useContext } from 'react'
import { StyleSheet, View } from 'react-native'

import { UserContext } from '@holi/core/user/UserContextProvider'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliText from '@holi/ui/components/HoliText'
import HoliUserAvatar from '@holi/ui/components/HoliUserAvatar'

type UserProfileViewProps = {
  editUser: () => void
}

const UserProfileView: React.VoidFunctionComponent<UserProfileViewProps> = ({ editUser }) => {
  const { user } = useContext(UserContext)

  if (!user) {
    return <HoliText>No user fetched</HoliText>
  }

  // TODO: hand over email, when firstName is empty
  const userImageLabel = user.firstName

  // TODO: should be generated during user registration process (HOLI-1525)
  const userDefaultColor = '#0f0'

  return (
    <>
      <View style={styles.profileHeader}>
        <View>
          <View>
            <HoliUserAvatar
              imageSrc={user.image}
              nameLabel={userImageLabel}
              defaultColor={userDefaultColor}
              size="large"
            />
          </View>
          <View>
            <HoliText>{user.firstName + ' ' + user.middleName + ' ' + user.lastName}</HoliText>
            <HoliText>{user.pronouns}</HoliText>
            <HoliText>{user.location}</HoliText>
          </View>
        </View>
        <HoliText>{user.aboutMe}</HoliText>
      </View>
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
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    padding: '16px 24px',
  },
})

export { UserProfileView }
