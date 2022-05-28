import React, { useContext, useState } from 'react'
import { Button, Text, View } from 'react-native'

import { UserContext } from '@holi/core/user/UserContextProvider'
import { UserProfileForm } from '@holi/core/user/components/UserProfileForm'
import { UserProfileView } from '@holi/core/user/components/UserProfileView'
import useRouting from '@holi/ui/components/navigation/useRouting'

export const UserProfileScreen: React.VFC = () => {
  const { navigate } = useRouting()
  const [editing, setEditing] = useState(false)
  const toggleEditing = () => setEditing(!editing)

  return (
    <View style={{ padding: 10, alignItems: 'center' }}>
      <Text style={{ fontSize: 20 }}>Profile</Text>
      {editing ? (
        <UserProfileForm onCancel={toggleEditing} onSubmit={toggleEditing} />
      ) : (
        <UserProfileView editUser={() => toggleEditing()} />
      )}
      <Button onPress={() => navigate('/login')} title="Login" />
      <Button onPress={() => navigate('/logout')} title="Logout" />
      <Button onPress={() => navigate('/registration')} title="Register" />
    </View>
  )
}
