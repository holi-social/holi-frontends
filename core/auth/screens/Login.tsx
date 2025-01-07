import { useApolloClient } from '@apollo/client'
import type { LoginFlow, UpdateLoginFlowBody } from '@ory/kratos-client'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import FormBuilder from '@holi/core/auth/components/FormBuilder'
import RegistrationButton from '@holi/core/auth/components/RegistrationButton'
import { hasIdentifier, initLoginFlow, submitLoginFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError, isUnverifiedUserError } from '@holi/core/auth/helpers/form'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { setLoginStateLoggedIn, useLoginState } from '@holi/core/auth/loginState'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import { HoliTextLinkTracked } from '@holi/core/components/Trackable'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { ArrowDownS, Close } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import { HoliHeading } from '@holi/ui/components/atoms/HoliHeading'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'

const Login = () => {
  const { isLoggedOut } = useLoginState()
  const [flow, setFlow] = useState<LoginFlow | undefined>(undefined)
  const safeSetFlow = useSafeDispatch(setFlow)
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { isLoaderShown, showLoader, hideLoader } = useLoader()
  const setScreenOptions = useSetScreenOptions()
  const client = useApolloClient()
  const { track } = useTracking()
  const redirect = useRedirect('/')

  const isWeb = Platform.OS === 'web'

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle: () => (
        <HoliHeading level="1" size="s">
          {t('auth.login')}
        </HoliHeading>
      ),
      headerLeft: () => (isWeb ? null : <HeaderBackButton icon={ArrowDownS} />),
      headerRight: () => (isWeb ? <HeaderBackButton icon={Close} /> : null),
      navigationCustomOptions: {
        footerShown: false,
      },
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
    track(TrackingEvent.Auth.LoginButtonPressed)
    if (!flow) return

    showLoader()

    try {
      const { data }: { data: OrySessionContext } = await submitLoginFlow(flow, payload, undefined)
      await client.clearStore()
      await setLoginStateLoggedIn(data)
      storeOnboardingState('finished')
      redirect(true)
    } catch (err) {
      if (hasIdentifier(payload) && isUnverifiedUserError(err)) {
        setVerificationFlowData(payload)
        storeOnboardingState('emailVerification')
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
    <DefaultLayout headerOverlap={Platform.OS === 'web'} keyboardShouldPersistTaps="always">
      <HoliContainer>
        <FormBuilder flow={flow} onSubmit={performLogin} style={styles.loginForm} isSignin={true} />

        <View style={styles.formItemContainer} testID="btn-to-forgot-password-form">
          <HoliTextLinkTracked
            label={t('auth.login.link.forgotPassword')}
            href="/forgotPassword"
            size="sm"
            textAlign="center"
            mobileNavigateBackFirst
            trackingEvent={TrackingEvent.Auth.ForgotPasswordButtonPressed}
          >
            {t('auth.login.link.forgotPassword')}
          </HoliTextLinkTracked>
        </View>

        <HoliGap size="l" />
        <HoliHeading level="2" align="center">
          {t('auth.login.signUp.link.headline')}
        </HoliHeading>

        <View style={styles.formItemContainer}>
          <RegistrationButton trackingEvent={TrackingEvent.Auth.RegisterButtonPressed} variant="secondary" />
        </View>
      </HoliContainer>
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
