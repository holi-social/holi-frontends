import { SelfServiceLoginFlow, SubmitSelfServiceLoginFlowBody } from '@ory/kratos-client'
import React, { useContext, useEffect, useState } from 'react'
import { Text } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthProvider'
import AuthLayout from '@holi/core/auth/AuthLayout'
import { SelfServiceFlow } from '@holi/core/auth/components'
import { initLoginFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { SessionContext } from '@holi/core/auth/helpers/sdk'
import HoliButton from '@holi/ui/components/HoliButton'
import useRouting from '@holi/ui/components/navigation/useRouting'

const Login: React.VoidFunctionComponent = () => {
  const { setSession } = useContext(AuthContext)
  const [flow, setFlow] = useState<SelfServiceLoginFlow | undefined>(undefined)
  const { navigate } = useRouting()

  const initializeFlow = () => {
    initLoginFlow().then((response) => {
      const { data: flow } = response
      // The flow was initialized successfully, let's set the form data:
      console.info('[Login.tsx] login flow initialized.')
      setFlow(flow)
    })
  }

  // When the component is mounted, we initialize a new use login flow:
  useEffect(() => initializeFlow(), [])

  // This will update the login flow with the user provided input:
  const onSubmit = (payload: SubmitSelfServiceLoginFlowBody) =>
    flow
      ? newKratosSdk()
          .submitSelfServiceLoginFlow(flow.id, undefined, payload)
          .then((response) => {
            return Promise.resolve(response.data as SessionContext)
          })
          .then((session) => {
            setSession(session)
            console.info('[Login.tsx] session created.')
            navigate('/')
          })
          .catch(handleFormSubmitError(setFlow, initializeFlow))
      : Promise.resolve()
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
