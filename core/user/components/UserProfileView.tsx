import React, { useContext } from 'react'
import { Image, StyleSheet, Text } from 'react-native'

import { UserContext } from '@holi/core/user/UserContextProvider'
import HoliButton from '@holi/ui/components/HoliButton'

type UserProfileViewProps = {
  editUser: () => void
}

const imageStyle = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
  },
})

const UserProfileView: React.VoidFunctionComponent<UserProfileViewProps> = ({ editUser }) => {
  const { user } = useContext(UserContext)

  if (!user) {
    return <Text>No user fetched</Text>
  }

  return (
    <>
      <Image style={imageStyle.image} source={{ uri: user.image }} />
      <Text>{user.firstName}</Text>
      <Text>{user.middleName}</Text>
      <Text>{user.lastName}</Text>
      <Text>{user.pronouns}</Text>
      <Text>{user.aboutMe}</Text>
      <Text>{user.location}</Text>
      <Text>{user.engagementLevel}</Text>
      <Text>{user.interests}</Text>
      <Text>{user.sdgs}</Text>
      <Text>{user.skills}</Text>
      <HoliButton label="Profile data" onPress={editUser}>
        Edit
      </HoliButton>
    </>
  )
}

export { UserProfileView }
