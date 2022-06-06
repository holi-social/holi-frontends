import { SelfServiceLoginFlow, SubmitSelfServiceLoginFlowBody } from '@ory/kratos-client'
import React, { useCallback, useContext, useState } from 'react'
import { Text } from 'react-native'

import { useFocusEffect } from '@react-navigation/native'

import AuthLayout from '@holi/core/auth/AuthLayout'
import { AuthContext } from '@holi/core/auth/AuthProvider'
import { SelfServiceFlow } from '@holi/core/auth/components'
import { initLoginFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { SessionContext, newKratosSdk } from '@holi/core/auth/helpers/sdk'
import HoliButton from '@holi/ui/components/HoliButton'
import useRouting from '@holi/ui/components/navigation/useRouting'

const Login: React.VoidFunctionComponent = () => {
  const { setSession } = useContext(AuthContext)
  const [flow, setFlow] = useState<SelfServiceLoginFlow | undefined>(undefined)
  const { navigate } = useRouting()

  const initializeFlow: () => Promise<void> = () => {
    return initLoginFlow().then((response) => {
      const { data: flow } = response
      // The flow was initialized successfully, let's set the form data:
      console.info('[Login.tsx] login flow initialized')
      setFlow(flow)
      return Promise.resolve()
    })
  }

  // When the component is mounted and every time it is focused anew, we initialize a new use login flow
  useFocusEffect(
    useCallback(() => {
      // noinspection JSIgnoredPromiseFromCall
      initializeFlow()
    }, [])
  )

  // This will update the login flow with the user provided input:
  const onSubmit = (payload: SubmitSelfServiceLoginFlowBody) => {
    if (!flow) {
      return Promise.resolve()
    } else {
      return newKratosSdk()
        .submitSelfServiceLoginFlow(flow.id, undefined, payload)
        .then((response) => response.data as SessionContext)
        .then((session) => {
          setSession(session)
          console.info('[Login.tsx] login successful')
          navigate('/')
        })
        .catch(handleFormSubmitError(setFlow, initializeFlow))
    }
  }

  return (
    <AuthLayout>
      <Text>Sign in to your account</Text>
      <SelfServiceFlow flow={flow} onSubmit={onSubmit} />
      <HoliButton label="" onPress={() => navigate('/registration')}>
        Register
      </HoliButton>
    </AuthLayout>
  )
}

export { Login }
