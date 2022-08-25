import { SelfServiceRegistrationFlow, SubmitSelfServiceRegistrationFlowBody } from '@ory/kratos-client'
import React, { useCallback, useContext, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import LoginRegistrationContainer from '@holi/core/auth/components/LoginRegistrationContainer'
import { initRegistrationFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { OrySessionContext, newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { displayError } from '@holi/core/errors/helpers'
import { useSafeDispatch } from '@holi/core/helpers'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

const Registration: React.VFC = () => {
  const { navigateBack } = useRouting()
  const { setNavigationHeader, clearNavigationHeader } = useNavigationHeader()
  const { setUserLoggedIn, isLoggedIn } = useContext(AuthContext)
  const [flow, setFlow] = useState<SelfServiceRegistrationFlow | undefined>(undefined)
  const { t } = useTranslation()
  // use safe versions of this function to prevent updating state of destroyed component
  const safeSetFlow = useSafeDispatch(setFlow)
  const isWeb = Platform.OS === 'web'

  const initializeFlow = useCallback(() => {
    if (isLoggedIn) return

    initRegistrationFlow()
      // The flow was initialized successfully, let's set the form data:
      .then(({ data: flow }) => {
        safeSetFlow(flow)
      })
      .catch((error) => displayError(error, t('auth.registration.error.initialization')))
  }, [safeSetFlow, t, isLoggedIn])

  // When the component is mounted, we initialize a new use login flow:
  useLayoutEffect(() => initializeFlow(), [initializeFlow])

  // update header
  useLayoutEffect(
    () => {
      setNavigationHeader({
        headerLeft: () => (
          <HoliButton
            label={t('navigation.headerLeft.back')}
            inline
            transparent
            onPress={() => navigateBack()}
            style={{ paddingHorizontal: 0 }}
          >
            <HoliIcon icon={isWeb ? 'arrow-left-s' : 'arrow-down-s'} size={30} />
          </HoliButton>
        ),
      })
      return clearNavigationHeader
    },
    // setNavigationHeader would cause endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // This will update the registration flow with the user provided input:
  const onSubmit = (payload: SubmitSelfServiceRegistrationFlowBody): Promise<void> =>
    flow
      ? newKratosSdk()
          .submitSelfServiceRegistrationFlow(flow.id, payload)
          .then(({ data }) => {
            // ORY Kratos can be configured in such a way that it requires a login after
            // registration. You could handle that case by navigating to the Login screen
            // but for simplicity we'll just print an error here:
            if (isWeb ? !data.session : !data.session_token) {
              const err = new Error(
                'It looks like you configured ORY Kratos to not issue a session automatically after registration. This edge-case is currently not supported in this example app. You can find more information on enabling this feature here: https://www.ory.sh/kratos/docs/next/self-service/flows/user-registration#successful-registration'
              )
              return Promise.reject(err)
            }
            console.info('[Registration.tsx] registration was successful.')
            setUserLoggedIn({
              session: data.session,
              session_token: data.session_token,
            } as OrySessionContext)
          })
          .catch(handleFormSubmitError(setFlow, initializeFlow))
          .catch((error) => displayError(error, t('auth.registration.error.registration')))
      : Promise.resolve()

  return (
    <DefaultLayout>
      <LoginRegistrationContainer flow={flow} onSubmit={onSubmit} mode="registration" />
    </DefaultLayout>
  )
}

export { Registration }
