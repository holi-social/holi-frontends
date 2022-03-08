import React from 'react'

import { Text } from 'react-native'
import { UserData } from 'shared/api'

const Users: React.VoidFunctionComponent<{ users: Array<UserData> }> = ({
  users,
}) => {
  return (
    <>
      {users.map((user) => (
        <Text key={user.id}>User ID: {user.id}</Text>
      ))}
    </>
  )
}

export default Users
