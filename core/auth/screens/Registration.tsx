import { RegistrationFlow, UpdateRegistrationFlowBody } from '@ory/kratos-client'
import React, { memo, useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import LoginRegistrationContainer from '@holi/core/auth/components/LoginRegistrationContainer'
import { initRegistrationFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { OrySessionContext, newKratosSdk } from '@holi/core/auth/helpers/sdk'
import CenteredContentLayout from '@holi/core/components/CenteredContentLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors, vars } from '@holi/ui/styles/globalVars'

const isWeb = Platform.OS === 'web'

const Registration: React.VFC = () => {
  const { setUserLoggedIn, isLoggedIn } = useAuth()
  const [flow, setFlow] = useState<RegistrationFlow | undefined>(undefined)
  const { t } = useTranslation()
  // use safe versions of this function to prevent updating state of destroyed component
  const safeSetFlow = useSafeDispatch(setFlow)
  const { displayError } = useErrorHandling()

  const initializeFlow = useCallback(() => {
    if (isLoggedIn) return

    initRegistrationFlow()
      // The flow was initialized successfully, let's set the form data:
      .then(({ data: flow }) => {
        safeSetFlow(flow)
      })
      .catch((error) => displayError(error, t('auth.registration.error.initialization')))
  }, [safeSetFlow, t, isLoggedIn, displayError])

  // When the component is mounted, we initialize a new use login flow:
  useLayoutEffect(() => initializeFlow(), [initializeFlow])

  // This will update the registration flow with the user provided input:
  const onSubmit = (payload: UpdateRegistrationFlowBody): Promise<void> =>
    flow
      ? newKratosSdk()
          .updateRegistrationFlow({ flow: flow.id, updateRegistrationFlowBody: payload })
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
    <CenteredContentLayout>
      <LoginRegistrationContainer>
        <View style={styles.inner}>
          <HoliHeading level="1" size="medium" style={styles.headline} testID="sign-up-headline">
            {t('registration.signUp.heading')}
          </HoliHeading>

          <HoliText style={styles.description}>{t('registration.signUp.describtion')}</HoliText>
        </View>

        <FormBuilder flow={flow} onSubmit={onSubmit} style={styles.loginForm} />

        <AlreadyHaveAccountText style={styles.loginHeadline} />
      </LoginRegistrationContainer>
    </CenteredContentLayout>
  )
}

export default memo(Registration)

const styles = StyleSheet.create({
  inner: {
    maxWidth: vars.breakpointL,
  },
  headline: {
    fontWeight: '400',
    marginTop: 74,
  },
  description: {
    color: colors.foreground20,
    marginTop: 16,
  },
  loginForm: {
    // reserves space for inputs plus submit until ory flow is done
    marginTop: 32,
    minHeight: 235,
    width: '100%',
  },
  headline3: {
    marginTop: 16,
  },
  loginHeadline: {
    marginTop: 16,
    textAlign: 'center',
  },
})
