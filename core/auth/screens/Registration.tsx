import { SelfServiceRegistrationFlow, SubmitSelfServiceRegistrationFlowBody } from '@ory/kratos-client'
import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import { initRegistrationFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { newKratosSdk } from '@holi/core/auth/helpers/sdk'
import useErrorHandling from '@holi/core/errors/useErrorHandling'
import { useNavigationContext } from '@holi/core/navigation/context'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliText from '@holi/ui/components/HoliText'

const Registration = () => {
  const { navigate } = useRouting()
  const { setBackLink, clearBackLinks } = useNavigationContext()
  const { setUserLoggedIn } = useContext(AuthContext)
  const [flow, setConfig] = useState<SelfServiceRegistrationFlow | undefined>(undefined)
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()

  const initializeFlow = () => {
    initRegistrationFlow()
      // The flow was initialized successfully, let's set the form data:
      .then(({ data: flow }) => {
        setConfig(flow)
      })
      .catch((error) => displayError(error, t('auth.registration.error.initialization')))
  }
  // When the component is mounted, we initialize a new use login flow:
  // eslint-disable-next-line
  useEffect(() => initializeFlow(), [])

  useEffect(() => {
    setBackLink('down')
    return () => clearBackLinks()
  }, [clearBackLinks, setBackLink])

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
            setUserLoggedIn(session)
            navigate('/')
          })
          .catch(handleFormSubmitError(setConfig, initializeFlow))
          .catch((error) => displayError(error, t('auth.registration.error.registration')))
      : Promise.resolve()

  return (
    <DefaultLayout>
      <HoliText>{t('auth.registration.heading')}</HoliText>
      <FormBuilder flow={flow} onSubmit={onSubmit} />
    </DefaultLayout>
  )
}

export { Registration }
