import React, { useContext } from 'react'
import { Button, Text, View } from 'react-native'
import { createParam } from 'solito'

import { UserContext } from '@holi/core/user/UserContextProvider'
import useRouting from '@holi/ui/components/navigation/useRouting'

export type UserProfileScreenParams = {
  userId: string
}

const { useParam } = createParam<UserProfileScreenParams>()

export const UserProfileScreen: React.VFC = () => {
  const { navigate } = useRouting()
  const [userId] = useParam('userId')
  const { user } = useContext(UserContext)
  if (user) {
    // Logged-in
    return (
      <View style={{ padding: 10, alignItems: 'center' }}>
        <Text style={{ fontSize: 20 }}>{user.name}&lsquo;s Profile</Text>
        <Button onPress={() => navigate('/logout')} title="Logout" />
      </View>
    )
  } else {
    // Logged-out
    return (
      <View style={{ padding: 10 }}>
        <Text>Profile userId={userId}</Text>
        <Button onPress={() => navigate('/login')} title="Login" />
        <Button onPress={() => navigate('/registration')} title="Register" />
      </View>
    )
  }
}
