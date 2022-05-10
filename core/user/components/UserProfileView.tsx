import React, { useContext } from 'react'
import { Text } from 'react-native'

import { UserContext } from '@holi/core/user/UserContextProvider'
import Button from '@holi/ui/components/Button'

type UserProfileViewProps = {
  editUser: () => void
}

const UserProfileView: React.VoidFunctionComponent<UserProfileViewProps> = ({ editUser }) => {
  const { user } = useContext(UserContext)

  if (!user) {
    return <Text>No user fetched</Text>
  }

  return (
    <>
      <Text>{user.name}</Text>
      <Text>({user.pronouns})</Text>
      <Text>{user.location}</Text>
      <Text>{user.aboutMe}</Text>
      <Button onPress={editUser}>Edit</Button>
    </>
  )
}

export { UserProfileView }
