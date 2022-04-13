import React, { useContext, useEffect, useState } from 'react'
import { SelfServiceRegistrationFlow, SubmitSelfServiceRegistrationFlowBody } from '@ory/kratos-client'
import { Platform, View, Text } from 'react-native'
import { SelfServiceFlow } from '@holi/core/auth/components'
import { newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { AuthContext } from '@holi/core/auth/AuthProvider'
import { getNodeId, handleFormSubmitError } from '@holi/core/auth/helpers/form'
import useRouting from '@holi/ui/components/navigation/useRouting'
import AuthLayout from '@holi/core/auth/authLayout'
import Button from '@holi/ui/components/Button'

const Registration = () => {
  const { navigate } = useRouting()

  const [flow, setConfig] = useState<SelfServiceRegistrationFlow | undefined>(undefined)
  const { setSession, isAuthenticated } = useContext(AuthContext)

  const initializeFlow = () => {
    newKratosSdk()
      .initializeSelfServiceRegistrationFlowWithoutBrowser()
      // The flow was initialized successfully, let's set the form data:
      .then(({ data: flow }) => {
        setConfig(flow)
      })
      .catch(console.error)
  }
  // When the component is mounted, we initialize a new use login flow:
  useEffect(() => initializeFlow(), [])

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated])

  if (isAuthenticated) {
    return null
  }

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

            // Looks like we got a session!
            return Promise.resolve({
              session: data.session,
              session_token: data.session_token,
            })
          })
          // Let's log the user in!
          .then(setSession)
          .catch(handleFormSubmitError(setConfig, initializeFlow))
      : Promise.resolve()

  return (
    <AuthLayout>
      <View>
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
      </View>

      <Button onPress={() => navigate('/login')}>Already have an account?</Button>
    </AuthLayout>
  )
}

export { Registration }
