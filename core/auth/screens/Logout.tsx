import { getAuthenticatedSession } from 'core/auth/helpers/auth'
import React, { useContext } from 'react'
import { Text, View } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthProvider'
import AuthLayout from '@holi/core/auth/authLayout'
import { submitLogoutFlow } from '@holi/core/auth/helpers/sdk'
import Button from '@holi/ui/components/Button'
import useRouting from '@holi/ui/components/navigation/useRouting'

const Logout: React.VoidFunctionComponent = () => {
  const { navigate } = useRouting()
  const { setSession } = useContext(AuthContext)

  const onSubmit = () => {
    getAuthenticatedSession()
      .then((session) => {
        const payload = { session_token: session ? session.session_token : '' }
        submitLogoutFlow(payload)
      })
      .then(() => {
        setSession(null)
        console.log('[Logout.tsx] logout successful.')
        navigate('/')
      })
      .catch((error) => {
        console.error('[Logout.tsx] ' + error.response)
      })
  }
  return (
    <AuthLayout>
      <View>
        <Text>Do you want to log out?</Text>
        <Button onPress={() => onSubmit()}>Log out</Button>
      </View>
    </AuthLayout>
  )
}

export { Logout }
