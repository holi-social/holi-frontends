import { LoginFlow, UpdateLoginFlowBody } from '@ory/kratos-client'
import React, { memo, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import client from '@holi/api/graphql/client'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import LoginRegistrationContainer from '@holi/core/auth/components/LoginRegistrationContainer'
import RegistrationButton from '@holi/core/auth/components/RegistrationButton'
import { hasIdentifier, initLoginFlow, submitLoginFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError, isUnverifiedUserError } from '@holi/core/auth/helpers/form'
import { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { setUserLoggedIn, useAuth } from '@holi/core/auth/helpers/useAuth'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useStoredOnboardingState } from '@holi/core/screens/onboarding/hooks'
import { ArrowDownS, Close } from '@holi/icons/src/generated'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliTextLink from '@holi/ui/components/atoms/HoliTextLink'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'

const Login = () => {
  const { isLoggedOut } = useAuth()
  const [flow, setFlow] = useState<LoginFlow | undefined>(undefined)
  const safeSetFlow = useSafeDispatch(setFlow)
  const { t } = useTranslation()
  const { navigate, navigateBack } = useRouting()
  const { displayError } = useErrorHandling()
  const { isLoaderShown, showLoader, hideLoader } = useLoader()
  const { storeOnboardingState } = useStoredOnboardingState()
  const setScreenOptions = useSetScreenOptions()
  const redirect = useRedirect()

  const isWeb = Platform.OS === 'web'

  useLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="s">
          {t('auth.login')}
        </HoliHeading>
      ),
      headerLeft: () => (isWeb ? null : <HeaderBackButton icon={ArrowDownS} />),
      headerRight: () => (isWeb ? <HeaderBackButton icon={Close} /> : null),
    })
  }, [isWeb, setScreenOptions, t])

  const initializeFlow = useCallback(() => {
    initLoginFlow()
      .then(safeSetFlow)
      .catch((error) =>
        displayError(error, 'Failed to initialize login flow', {
          displayMessage: t('auth.login.error.initialization'),
          location: 'Login.initializeFlow',
        })
      )
  }, [t, safeSetFlow, displayError])

  useEffect(() => {
    isLoggedOut && !flow && initializeFlow()
  }, [isLoggedOut, initializeFlow, flow])

  const performLogin = async (payload: UpdateLoginFlowBody) => {
    if (!flow) return

    showLoader()

    try {
      const { data }: { data: OrySessionContext } = await submitLoginFlow(flow, payload, undefined)
      await client.clearStore()
      await setUserLoggedIn(data)
      await storeOnboardingState('finished')

      redirect()
    } catch (err) {
      if (hasIdentifier(payload) && isUnverifiedUserError(err)) {
        setVerificationFlowData(payload)
        await storeOnboardingState('emailVerification')

        if (isWeb) {
          navigate('/')
        } else {
          // for Mobile we need first to close Loing modal
          navigateBack()
          // and then navigate to onboarding
          // timeout is used for correct animation of closing modal and navigating
          setTimeout(() => navigate('/onboarding'), 300)
        }
      } else {
        handleFormSubmitError(
          safeSetFlow,
          initializeFlow,
          (err) =>
            displayError(err, 'Failed to login user', {
              displayMessage: t('auth.login.error.login'),
              location: 'Login.performLogin',
            }),
          err
        )
      }
    } finally {
      hideLoader()
    }
  }

  return (
    <DefaultLayout headerOverlap={true} keyboardShouldPersistTaps="always">
      <HoliBox padding={[0, 24]}>
        <LoginRegistrationContainer>
          <FormBuilder flow={flow} onSubmit={performLogin} style={styles.loginForm} isSignin={true} />

          <View style={styles.formItemContainer}>
            <HoliTextLink
              label={t('auth.login.link.forgotPassword')}
              href="/forgotPassword"
              size="small"
              variant="secondary"
              mobileNavigateBackFirst
              testID="btn-to-forgot-password-form"
            >
              {t('auth.login.link.forgotPassword')}
            </HoliTextLink>
          </View>

          <HoliGap size="l" />
          <HoliHeading level="2">{t('auth.login.signUp.link.headline')}</HoliHeading>

          <RegistrationButton style={styles.formItemContainer} />
        </LoginRegistrationContainer>
      </HoliBox>
      {isLoaderShown && <HoliLoader />}
    </DefaultLayout>
  )
}

export default memo(Login)

const styles = StyleSheet.create({
  loginForm: {
    // reserves space for inputs plus submit until ory flow is done
    minHeight: 235,
    width: '100%',
  },
  formItemContainer: {
    marginTop: 20,
  },
})
