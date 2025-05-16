import { useApolloClient } from '@apollo/client'
import type { LoginFlow, UpdateLoginFlowBody } from '@ory/kratos-client'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import FormBuilder from '@holi/core/auth/components/FormBuilder'
import RegistrationButton from '@holi/core/auth/components/RegistrationButton'
import { doBrowserLogin, doLogin, hasIdentifier, initLoginFlow, submitLoginFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError, isUnverifiedUserError } from '@holi/core/auth/helpers/form'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { useLoginState } from '@holi/core/auth/loginState'
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
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import { Screen } from '@holi/core/components/Screen'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { getBrowserRedirect } from '@holi/core/auth/helpers/helper'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { Text } from 'holi-bricks/components/text'

export type LoginParams = {
  flow?: string
}

const { useParam } = createParamHooks<LoginParams>()

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
  const { navigate } = useRouting()
  const [flowId] = useParam('flow')

  const isWeb = Platform.OS === 'web'

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({
      headerBackVisible: false,
      headerTitleAlign: 'center',
      headerTitle: () => (
        <Text headingLevel="1" size="lg">
          {t('auth.login')}
        </Text>
      ),
      headerLeft: () => (isWeb ? null : <HeaderBackButton icon={ArrowDownS} />),
      headerRight: () => (isWeb ? <HeaderBackButton icon={Close} /> : null),
      navigationCustomOptions: {
        footerShown: false,
      },
    })
  }, [isWeb, setScreenOptions, t])

  const initializeFlow = useCallback(() => {
    initLoginFlow(flowId)
      .then(safeSetFlow)
      .catch((error) =>
        displayError(error, 'Failed to initialize login flow', {
          displayMessage: t('auth.login.error.initialization'),
          location: 'Login.initializeFlow',
        })
      )
  }, [t, safeSetFlow, displayError, flowId])

  useEffect(() => {
    if (isLoggedOut && !flow) {
      initializeFlow()
    } else if (!isLoggedOut) {
      navigate('/')
    }
  }, [isLoggedOut, initializeFlow, flow, navigate])

  const performLogin = async (payload: UpdateLoginFlowBody, provider?: string) => {
    track(provider ? TrackingEvent.Auth.SocialLoginButtonPressed(provider) : TrackingEvent.Auth.LoginButtonPressed)
    if (!flow) return

    showLoader()

    try {
      const { data }: { data: OrySessionContext } = await submitLoginFlow(flow, payload, provider, undefined)
      if (!data) {
        return
      }
      await doLogin(client, data)
      storeOnboardingState('finished')
      redirect(true)
    } catch (err) {
      const url = getBrowserRedirect(err)
      if (url) {
        if (Platform.OS === 'web') {
          navigate(url)
        } else {
          const data = await doBrowserLogin(url, flow).catch((error) => {
            handleFormSubmitError(
              safeSetFlow,
              initializeFlow,
              (err) =>
                displayError(err, 'Failed to login user', {
                  displayMessage: t('auth.login.error.login'),
                  location: 'Login.doBrowserLogin',
                }),
              error
            )
          })
          if (data) {
            await doLogin(client, data)
            storeOnboardingState('finished')
            redirect(true)
          }
        }
      } else {
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
      }
    } finally {
      hideLoader()
    }
  }

  return (
    <Screen preset="scroll" backgroundColor="support" keyboardShouldPersistTaps="always">
      <DefaultLayout>
        <HoliContainer>
          <FormBuilder flow={flow} onSubmit={performLogin} style={styles.loginForm} isSignin={true} />

          <View style={styles.formItemContainer} testID="btn-to-forgot-password-form">
            <HoliTextLinkTracked
              label={t('auth.login.link.forgotPassword')}
              href="/forgotPassword"
              size="sm"
              textAlign="center"
              trackingEvent={TrackingEvent.Auth.ForgotPasswordButtonPressed}
            >
              {t('auth.login.link.forgotPassword')}
            </HoliTextLinkTracked>
          </View>

          <HoliGap size="l" />
          <Text headingLevel="2" size="xxl" textAlign="center">
            {t('auth.login.signUp.link.headline')}
          </Text>

          <View style={styles.formItemContainer}>
            <RegistrationButton trackingEvent={TrackingEvent.Auth.RegisterButtonPressed} />
          </View>
        </HoliContainer>
        {isLoaderShown && <HoliLoader testID="loader" />}
      </DefaultLayout>
    </Screen>
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
