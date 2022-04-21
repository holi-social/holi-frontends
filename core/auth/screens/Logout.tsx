import React, { useContext } from 'react'
import { Text, View } from 'react-native'
import { SubmitSelfServiceLogoutFlowWithoutBrowserBody } from '@ory/kratos-client'
import { submitLogoutFlow } from '@holi/core/auth/helpers/auth'
import { AuthContext } from '@holi/core/auth/AuthProvider'
import AuthLayout from '@holi/core/auth/authLayout'
import Button from '@holi/ui/components/Button'
import useRouting from '@holi/ui/components/navigation/useRouting'
import { killAuthenticatedSession } from '@holi/core/auth/helpers/auth.web'

const Logout: React.VoidFunctionComponent = () => {
  const { isAuthenticated, session, sessionToken, setSession } = useContext(AuthContext)
  const { navigate } = useRouting()

  if (!isAuthenticated || !session) {
    //navigate('/login')
  }
  const payload = { session_token: sessionToken ? sessionToken : '' }

  const onSubmit = (payload: SubmitSelfServiceLogoutFlowWithoutBrowserBody) => {
    submitLogoutFlow(payload)
      .then((session) => {
        killAuthenticatedSession()
        setSession(null)
        console.log('[Logout.tsx] logout successful.' + session.data)
        setTimeout(() => {
          navigate('/')
        }, 100)
      })
      .catch((error) => {
        console.error('[Logout.tsx] ' + error.response)
      })
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
