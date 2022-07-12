import { SelfServiceLoginFlow, SubmitSelfServiceLoginFlowBody } from '@ory/kratos-client'
import React, { useContext, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

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
import HoliHeading from '@holi/ui/components/HoliHeading'
import HoliText from '@holi/ui/components/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const Login: React.VoidFunctionComponent = () => {
  const { isLoggedIn, setUserLoggedIn } = useContext(AuthContext)
  const [flow, setFlow] = useState<SelfServiceLoginFlow | undefined>(undefined)
  const { navigateBack } = useRouting()
  const { setShowBackLink } = useNavigationContext()
  const { displayError } = useErrorHandling()
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = getStyles(theme)

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
      <View style={styles.login}>
        {isLoggedIn ? (
          <HoliText>{t('auth.login.alreadyLoggedIn')}</HoliText>
        ) : (
          <>
            <HoliHeading level="1" size="super" style={{ marginTop: 50 }}>
              {t('auth.login.heading')}
            </HoliHeading>
            <FormBuilder flow={flow} onSubmit={onSubmit} style={styles.loginForm} />
          </>
        )}
      </View>
    </DefaultLayout>
  )
}

export { Login }

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    login: {
      paddingBottom: 50,
      marginBottom: 50,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    loginForm: {
      marginTop: 20,
      borderWidth: 1,
      borderColor: 'red',
      width: '100%',
      paddingHorizontal: 20,
      maxWidth: 500,
    },
  })
