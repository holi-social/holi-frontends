// This file renders the login screen.
import React, { useContext } from 'react'
import { SubmitSelfServiceLogoutFlowWithoutBrowserBody } from '@ory/kratos-client'
import { newKratosSdk } from 'shared/features/authentication/helpers/sdk'
import { AuthContext } from 'shared/features/authentication/AuthProvider'
import AuthLayout from 'shared/features/authentication/authLayout'
import Button from 'shared/components/ui/Button'
import { Text, View } from 'react-native'
import useRouting from 'shared/components/navigation/useRouting'

const Logout: React.VoidFunctionComponent = () => {
  const { isAuthenticated, session, sessionToken } = useContext(AuthContext)
  const { navigate } = useRouting()

  if (!isAuthenticated || !session) {
    navigate('/login')
  }
  const payload = { session_token: sessionToken ? sessionToken : '' }

  const onSubmit = (payload: SubmitSelfServiceLogoutFlowWithoutBrowserBody) => {
    newKratosSdk()
      .submitSelfServiceLogoutFlowWithoutBrowser(payload)
      .then(({ data }) => Promise.resolve(data))
      // Looks like everything worked and we have a session!
      .then((session) => {
        console.log(session)
        setTimeout(() => {
          navigate('/login')
        }, 100)
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
