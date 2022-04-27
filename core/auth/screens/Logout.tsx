import { SubmitSelfServiceLogoutFlowWithoutBrowserBody } from '@ory/kratos-client'
import React, { useContext } from 'react'
import { Text, View } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthProvider'
import AuthLayout from '@holi/core/auth/authLayout'
import { killAuthenticatedSession, submitLogoutFlow } from '@holi/core/auth/helpers/auth'
import Button from '@holi/ui/components/Button'
import useRouting from '@holi/ui/components/navigation/useRouting'

const Logout: React.VoidFunctionComponent = () => {
  const { sessionToken, setSession } = useContext(AuthContext)
  const { navigate } = useRouting()

  const payload = { session_token: sessionToken ? sessionToken : '' }

  const onSubmit = (payload: SubmitSelfServiceLogoutFlowWithoutBrowserBody) => {
    submitLogoutFlow(payload)
      .then(({ data }) => Promise.resolve(data))
      .then(killAuthenticatedSession)
      .then(() => {
        setSession(null)
        console.log('[Logout.tsx] logout successful.')
        setTimeout(() => {
          navigate('/')
        }, 100)
      })
      .catch((e) => console.error('[Logout.tsx] ' + e))
  }
  return (
    <AuthLayout>
      <View>
        <Text>Do you want to log out?</Text>
        <Button onPress={() => onSubmit(payload)}>Log out</Button>
      </View>
    </AuthLayout>
  )
}

export { Logout }
