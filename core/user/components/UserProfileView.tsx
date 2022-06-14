import React, { useContext } from 'react'
import { Text } from 'react-native'

import { UserContext } from '@holi/core/user/UserContextProvider'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliUserAvatar from '@holi/ui/components/HoliUserAvatar'

type UserProfileViewProps = {
  editUser: () => void
}

const UserProfileView: React.VoidFunctionComponent<UserProfileViewProps> = ({ editUser }) => {
  const { user } = useContext(UserContext)

  if (!user) {
    return <Text>No user fetched</Text>
  }

  // TODO: hand over email, when firstName is empty
  const userImageLabel = user.firstName

  // TODO: should be generated during user registration process (HOLI-1525)
  const userDefaultColor = '#0f0'

  return (
    <>
      <HoliUserAvatar imageSrc={user.image} userName={userImageLabel} defaultColor={userDefaultColor} size="large" />

      <Text>{user.firstName}</Text>
      <Text>{user.middleName}</Text>
      <Text>{user.lastName}</Text>
      <Text>{user.pronouns}</Text>
      <Text>{user.aboutMe}</Text>
      <Text>{user.location}</Text>
      <Text>{user.engagementLevel}</Text>
      <Text>{user.interests.join(', ')}</Text>
      <Text>{user.sdgs.join(', ')}</Text>
      <Text>{user.skills.join(', ')}</Text>
      <HoliButton label="Profile data" onPress={editUser}>
        Edit
      </HoliButton>
    </>
  )
}

export { UserProfileView }
