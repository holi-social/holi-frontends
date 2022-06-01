import { SelfServiceRegistrationFlow, SubmitSelfServiceRegistrationFlowBody } from '@ory/kratos-client'
import React, { useContext, useEffect, useState } from 'react'
import { Platform, Text } from 'react-native'

import AuthLayout from '@holi/core/auth/AuthLayout'
import { AuthContext } from '@holi/core/auth/AuthProvider'
import { SelfServiceFlow } from '@holi/core/auth/components'
import { initRegistrationFlow } from '@holi/core/auth/helpers/auth'
import { getNodeId, handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { newKratosSdk } from '@holi/core/auth/helpers/sdk'
import HoliButton from '@holi/ui/components/HoliButton'
import useRouting from '@holi/ui/components/navigation/useRouting'

const Registration = () => {
  const { navigate } = useRouting()
  const { setSession } = useContext(AuthContext)
  const [flow, setConfig] = useState<SelfServiceRegistrationFlow | undefined>(undefined)

  const initializeFlow = () => {
    initRegistrationFlow()
      // The flow was initialized successfully, let's set the form data:
      .then(({ data: flow }) => {
        setConfig(flow)
      })
      .catch((error) => console.error('[Registration.tsx] initializeFlow error:', error))
  }
  // When the component is mounted, we initialize a new use login flow:
  useEffect(() => initializeFlow(), [])

  // This will update the registration flow with the user provided input:
  const onSubmit = (payload: SubmitSelfServiceRegistrationFlowBody): Promise<void> =>
    flow
      ? newKratosSdk()
          .submitSelfServiceRegistrationFlow(flow.id, payload)
          .then(({ data }) => {
            // ORY Kratos can be configured in such a way that it requires a login after
            // registration. You could handle that case by navigating to the Login screen
            // but for simplicity we'll just print an error here:
            if (!data.session_token || !data.session) {
              const err = new Error(
                'It looks like you configured ORY Kratos to not issue a session automatically after registration. This edge-case is currently not supported in this example app. You can find more information on enabling this feature here: https://www.ory.sh/kratos/docs/next/self-service/flows/user-registration#successful-registration'
              )
              return Promise.reject(err)
            }
            console.info('[Registration.tsx] registration was successful.')
            // Looks like we got a session!
            return Promise.resolve({
              session: data.session,
              session_token: data.session_token,
            })
          })
          .then((session) => {
            setSession(session)
            navigate('/')
          })
          .catch(handleFormSubmitError(setConfig, initializeFlow))
      : Promise.resolve()

  return (
    <AuthLayout>
      <Text>Create an account</Text>
      <SelfServiceFlow
        textInputOverride={(field, props) => {
          const iOS12Plus = Platform.OS === 'ios' && parseInt(String(Platform.Version), 10) >= 12
          switch (getNodeId(field)) {
            case 'traits.email':
              return {
                autoCapitalize: 'none',
                autoCompleteType: 'email',
                textContentType: 'username',
                autoCorrect: false,
              }
            case 'password':
              return {
                textContentType: iOS12Plus ? 'newPassword' : 'password',
                secureTextEntry: true,
              }
          }
          return props
        }}
        flow={flow}
        onSubmit={onSubmit}
      />
      <HoliButton label="Go to login" onPress={() => navigate('/login')}>
        Already have an account?
      </HoliButton>
    </AuthLayout>
  )
}

export { Registration }
