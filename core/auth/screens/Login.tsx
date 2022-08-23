import { SelfServiceLoginFlow, SubmitSelfServiceLoginFlowBody } from '@ory/kratos-client'
import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import LoginRegistrationContainer from '@holi/core/auth/components/LoginRegistrationContainer'
import { initLoginFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { displayError } from '@holi/core/errors/helpers'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

const Login: React.VoidFunctionComponent = () => {
  const { setUserLoggedIn } = useContext(AuthContext)
  const [flow, setFlow] = useState<SelfServiceLoginFlow | undefined>(undefined)
  const { navigateBack } = useRouting()
  const { setNavigationHeader, clearNavigationHeader } = useNavigationHeader()
  const { t } = useTranslation()

  const initializeFlow = () => {
    initLoginFlow()
      .then((response) => {
        const { data: flow } = response
        // The flow was initialized successfully, let's set the form data:
        setFlow(flow)
      })
      .catch((error) => displayError(error, t('auth.login.error.initialization')))
  }

  // When the component is mounted, we initialize a new use login flow:
  // eslint-disable-next-line
  useEffect(() => initializeFlow(), [])

  useEffect(
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
            <HoliIcon icon="arrow-down-s" size={30} />
          </HoliButton>
        ),
      })
      return clearNavigationHeader
    },
    // setNavigationHeader would cause endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // This will update the login flow with the user provided input:
  const onSubmit = (payload: SubmitSelfServiceLoginFlowBody) =>
    flow
      ? newKratosSdk()
          .submitSelfServiceLoginFlow(flow.id, undefined, payload)
          .then(({ data }) => {
            setUserLoggedIn(data as OrySessionContext)
          })
          .then(() => {
            console.info('[Login] session created')
          })
          .catch(handleFormSubmitError(setFlow, initializeFlow))
          .catch((error) => displayError(error, t('auth.login.error.login')))
      : Promise.resolve()

  // this should only occur when a logged-in user navigates to /login on web
  return (
    <DefaultLayout>
      <LoginRegistrationContainer flow={flow} onSubmit={onSubmit} />
    </DefaultLayout>
  )
}

export { Login }
