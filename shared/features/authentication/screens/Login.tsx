// This file renders the login screen.
import React, { useContext, useState, useCallback } from 'react'
import { useFocusEffect } from '@react-navigation/native'
import { SelfServiceLoginFlow, SubmitSelfServiceLoginFlowBody } from '@ory/kratos-client'

import { SelfServiceFlow } from 'shared/features/authentication/components'
import { newKratosSdk } from 'shared/features/authentication/helpers/sdk'
import { AuthContext } from 'shared/features/authentication/AuthProvider'
import { handleFormSubmitError } from 'shared/features/authentication/helpers/form'
import { SessionContext } from 'shared/features/authentication/helpers/auth'
import AuthLayout from 'shared/features/authentication/authLayout'
import Button from 'shared/components/ui/Button'
import { Text, View } from 'react-native'
import useRouting from 'shared/components/navigation/useRouting'

const Login: React.VoidFunctionComponent = () => {
  const { isAuthenticated, setSession, session, sessionToken } = useContext(AuthContext)
  const [flow, setFlow] = useState<SelfServiceLoginFlow | undefined>(undefined)
  const { navigate } = useRouting()

  if (isAuthenticated || session) {
    return (
      <AuthLayout>
        <View>
          <Text>You are alreday logged in.</Text>
          <Button onPress={() => navigate('/logout')}>Log out</Button>
        </View>
      </AuthLayout>
    )
  }

  const initializeFlow = () =>
    newKratosSdk()
      .initializeSelfServiceLoginFlowWithoutBrowser()
      .then((response) => {
        const { data: flow } = response
        // The flow was initialized successfully, let's set the form data:
        setFlow(flow)
      })
      .catch(console.error)

  /// When the component is mounted, we initialize a new use login flow:
  useFocusEffect(
    useCallback(() => {
      initializeFlow()

      return () => {
        setFlow(undefined)
      }
    }, [])
  )
  // This will update the login flow with the user provided input:
  const onSubmit = (payload: SubmitSelfServiceLoginFlowBody) =>
    flow
      ? newKratosSdk()
          .submitSelfServiceLoginFlow(flow.id, sessionToken, payload)
          .then(({ data }) => Promise.resolve(data as SessionContext))
          // Looks like everything worked and we have a session!
          .then((session) => {
            setSession(session)
            setTimeout(() => {
              navigate('/community')
            }, 100)
          })
          .catch(handleFormSubmitError(setFlow, initializeFlow))
      : Promise.resolve()

  return (
    <AuthLayout>
      <View>
        <Text>Sign in to your account</Text>
        <SelfServiceFlow flow={flow} onSubmit={onSubmit} />
        <Button onPress={() => navigate('/registration')}>Register</Button>
      </View>
    </AuthLayout>
  )
}

export { Login }
