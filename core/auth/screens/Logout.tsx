import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import { submitLogoutFlow } from '@holi/core/auth/helpers/sdk'
import AuthLayout from '@holi/core/auth/authLayout'
import Button from '@holi/ui/components/Button'
import { AuthContext } from '@holi/core/auth/AuthProvider'
import useRouting from '@holi/ui/components/navigation/useRouting'
import { getAuthenticatedSession, killAuthenticatedSession } from '@holi/core/auth/helpers/auth'

const Logout: React.VoidFunctionComponent = () => {
  const { navigate } = useRouting()
  const { setSession } = useContext(AuthContext)


  const onSubmit = () => {
    getAuthenticatedSession()
      .then((session) => {
        const payload = { session_token: session ? session.session_token : '' }
        submitLogoutFlow(payload)
      })
      .then((session) => {
        killAuthenticatedSession()
        setSession(null)
        console.log('[Logout.tsx] logout successful.' + session)
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
