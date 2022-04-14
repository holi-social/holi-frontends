// This file renders the login screen.
import React, { useContext, useState, useEffect, useCallback } from 'react'
import { SelfServiceLoginFlow, SubmitSelfServiceLoginFlowBody } from '@ory/kratos-client'

import { SelfServiceFlow } from '@holi/core/auth/components'
import { newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { AuthContext } from '@holi/core/auth/AuthProvider'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { initLoginFlow, SessionContext } from '@holi/core/auth/helpers/auth'
import AuthLayout from '@holi/core/auth/authLayout'
import Button from '@holi/ui/components/Button'
import { Text, View } from 'react-native'
import useRouting from '@holi/ui/components/navigation/useRouting'

const Login: React.VoidFunctionComponent = () => {
  const { setSession, session, sessionToken } = useContext(AuthContext)
  const [flow, setFlow] = useState<SelfServiceLoginFlow | undefined>(undefined)
  const { navigate } = useRouting()
  console.log('Login')

  if (session) {
    navigate('/')
  }

  const initializeFlow = () => {
    initLoginFlow()
      .then((response) => {
        const { data: flow } = response
        // The flow was initialized successfully, let's set the form data:
        console.log('set flow')
        setFlow(flow)
      })
      .catch(console.error)
  }

  // When the component is mounted, we initialize a new use login flow:
  useEffect(() => initializeFlow(), [])

  // This will update the login flow with the user provided input:
  const onSubmit = (payload: SubmitSelfServiceLoginFlowBody) =>
    flow
      ? newKratosSdk()
          .submitSelfServiceLoginFlow(flow.id, sessionToken, payload)
          .then((response) => {
            console.log('[Login.tsx] response headers', response.headers)
            return Promise.resolve(response.data as SessionContext)
          })
          .then((session) => {
            setSession(session)
            setTimeout(() => {
              navigate('/')
            }, 100)
          })
          .catch((error) => console.error('[Login.tsx] error:', error))
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
