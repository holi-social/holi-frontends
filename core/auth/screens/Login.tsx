import { SelfServiceLoginFlow, SubmitSelfServiceLoginFlowBody } from '@ory/kratos-client'
import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { AuthContext } from '@holi/core/auth/AuthProvider'
import { FormBuilder } from '@holi/core/auth/components'
import { initLoginFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { newKratosSdk } from '@holi/core/auth/helpers/sdk'
import { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import useErrorHandling from '@holi/core/errors/useErrorHandling'
import { useNavigationContext } from '@holi/core/navigation/context'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliButton from '@holi/ui/components/HoliButton'
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliText from '@holi/ui/components/HoliText'

const Login: React.VoidFunctionComponent = () => {
  const { isLoggedIn, setUserLoggedIn } = useContext(AuthContext)
  const [flow, setFlow] = useState<SelfServiceLoginFlow | undefined>(undefined)
  const { navigateBack } = useRouting()
  const { setShowBackLink } = useNavigationContext()
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()

  const initializeFlow = () => {
    initLoginFlow()
      .then((response) => {
        const { data: flow } = response
        // The flow was initialized successfully, let's set the form data:
        console.info('[Login] login flow initialized.')
        setFlow(flow)
        // TODO: jump into first input element after form is shown
      })
      .catch((error) => displayError(error, t('auth.login.error.initialization')))
  }

  // When the component is mounted, we initialize a new use login flow:
  useEffect(() => initializeFlow(), [])

  useEffect(() => {
    setShowBackLink(true)
    return () => setShowBackLink(false)
  }, [])

  // This will update the login flow with the user provided input:
  const onSubmit = (payload: SubmitSelfServiceLoginFlowBody) =>
    flow
      ? newKratosSdk()
          .submitSelfServiceLoginFlow(flow.id, undefined, payload)
          .then((response) => {
            return Promise.resolve(response.data as OrySessionContext)
          })
          .then((session) => {
            return setUserLoggedIn(session).then(() => {
              console.info('[Login] session created')
              navigateBack()
            })
          })
          .catch(handleFormSubmitError(setFlow, initializeFlow))
          .catch((error) => displayError(error, t('auth.login.error.login')))
      : Promise.resolve()

  // this should only occur when a logged-in user navigates to /login on web
  return (
    <DefaultLayout>
      <View style={styles.container}>
        {isLoggedIn ? (
          <HoliText>{t('auth.login.alreadyLoggedIn')}</HoliText>
        ) : (
          <View style={styles.formContainer}>
            <FormBuilder flow={flow} onSubmit={onSubmit} style={styles.loginForm} />
            <HoliButton transparent inline label="some label" variant="small" style={styles.button}>
              {t('auth.login.link.forgotPassword')}
            </HoliButton>
            <HoliHeading level="2" style={styles.headline2}>
              {t('auth.login.signUp.link.headline')}
            </HoliHeading>
            <HoliButton label="" type="secondary" style={styles.button}>
              {t('auth.login.signUp.link.button')}
            </HoliButton>
          </View>
        )}
      </View>
    </DefaultLayout>
  )
}

export { Login }

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 34,
    ...Platform.select({
      native: {
        // enables scroll up when keyboard overlaps submit button
        marginBottom: 500,
      },
    }),
    minHeight: '100%',
    paddingTop: 60,
    alignItems: 'center',
  },
  formContainer: {
    maxWidth: 500,
    width: '100%',
    alignItems: 'center',
  },
  loginForm: {
    // reserves space for inputs plus submit until ory flow is done
    minHeight: 235,
    width: '100%',
  },
  button: {
    marginTop: 20,
  },
  headline2: {
    marginTop: 40,
  },
})
