import React, { useContext } from 'react'
import { Text, View } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthProvider'
import AuthLayout from '@holi/core/auth/authLayout'
import { getAuthenticatedSession } from '@holi/core/auth/helpers/auth'
import { submitLogoutFlow } from '@holi/core/auth/helpers/sdk'
import Button from '@holi/ui/components/Button'
import useRouting from '@holi/ui/components/navigation/useRouting'

const Logout: React.VoidFunctionComponent = () => {
  const { navigate } = useRouting()
  const { setSession } = useContext(AuthContext)

<<<<<<< HEAD
  const onSubmit = () => {
    getAuthenticatedSession()
      .then((session) => {
        const payload = { session_token: session ? session.session_token : '' }
        submitLogoutFlow(payload)
      })
      .then(() => {
=======
  const payload = { session_token: sessionToken ? sessionToken : '' }

  const onSubmit = (payload: SubmitSelfServiceLogoutFlowWithoutBrowserBody) => {
    submitLogoutFlow(payload)
      .then(({ data }) => Promise.resolve(data))
      // Looks like everything worked and we have a session!
      .then(() => {
        killAuthenticatedSession()
>>>>>>> call error handling function correctly
        setSession(null)
        console.log('[Logout.tsx] logout successful.')
        navigate('/')
      })
      .catch((error) => {
        console.error('[Logout.tsx] ' + error.response)
      })
<<<<<<< HEAD
=======
      .catch((e) => {
        killAuthenticatedSession()
        setSession(null)
        throw e
      })
>>>>>>> call error handling function correctly
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
