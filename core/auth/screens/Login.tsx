import { LoginFlow, UpdateLoginFlowBody } from '@ory/kratos-client'
import React, { memo, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import client from '@holi/api/graphql/client'
import ChatLogin from '@holi/chat/src/client/ChatLogin'
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
import { confirmOAuth2Login } from '@holi/core/helpers/oauth2'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import createParam, { singleParamConfig } from '@holi/core/navigation/hooks/useParam'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliTextLink from '@holi/ui/components/atoms/HoliTextLink'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'

export type LoginParams = {
  return_to?: string
}

const IS_CHAT_ENABLED = false
const chatLoginClient = new ChatLogin()

const { useParam } = createParam<LoginParams>()

const Login = () => {
  const { userId } = useAuth()
  const [flow, setFlow] = useState<LoginFlow | undefined>(undefined)
  const safeSetFlow = useSafeDispatch(setFlow)
  const { t } = useTranslation()
  const [return_to] = useParam('return_to', singleParamConfig)
  const { navigate } = useRouting()
  const { displayError } = useErrorHandling()
  const { isLoaderShown, showLoader, hideLoader } = useLoader()
  const { onOnboardingStateChange } = useOnboarding()
  const setScreenOptions = useSetScreenOptions()
  const redirect = useRedirect()

  const isLoggedIn = !!userId

  useLayoutEffect(() => {
    setScreenOptions({
      headerTitle: () => (
        <HoliHeading level="1" size="small">
          {t('auth.login')}
        </HoliHeading>
      ),
      headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon="arrow-down-s" />),
      headerRight: () => (Platform.OS === 'web' ? <HeaderBackButton icon="close" /> : null),
    })
  }, [setScreenOptions, t])

  useLayoutEffect(() => {
    // OAuth2 needs initial redirect
    // see: See apps/web/pages/oauth2/login.tsx
    if (Platform.OS === 'web' && isLoggedIn && return_to) {
      confirmOAuth2Login()
      window.location.href = return_to
    }
  }, [return_to, isLoggedIn])

  const initializeFlow = useCallback(() => {
    initLoginFlow()
      .then(safeSetFlow)
      .catch((error) => displayError(error, t('auth.login.error.initialization')))
  }, [t, safeSetFlow, displayError])

  useEffect(() => {
    !isLoggedIn && !flow && initializeFlow()
  }, [isLoggedIn, initializeFlow, flow])

  const performLogin = async (payload: UpdateLoginFlowBody) => {
    if (!flow) return

    showLoader()

    try {
      const { data } = await submitLoginFlow(flow, payload, undefined)
      await client.clearStore()
      await setUserLoggedIn(data as OrySessionContext)
      await onOnboardingStateChange('finished')
      confirmOAuth2Login()

      // Get Matrix Server Token
      // Currently its disabled
      if (IS_CHAT_ENABLED) {
        await chatLoginClient.setSessionCredentials(true)
      }

      if (Platform.OS === 'web' && return_to) {
        // server side redirect, see: See apps/web/pages/oauth2/login.tsx
        window.location.href = return_to
      } else {
        redirect()
      }
    } catch (err) {
      if (hasIdentifier(payload) && isUnverifiedUserError(err)) {
        setVerificationFlowData(payload)
        await onOnboardingStateChange('emailVerification')

        navigate('/')
        if (Platform.OS !== 'web') {
          navigate('/onboarding')
        }
      } else {
        handleFormSubmitError(safeSetFlow, initializeFlow, (err) => displayError(err, t('auth.login.error.login')), err)
      }
    } finally {
      hideLoader()
    }
  }

  return (
    <DefaultLayout headerOverlap={true} keyboardShouldPersistTaps="always">
      <HoliBox padding={[0, 24]}>
        <LoginRegistrationContainer>
          <FormBuilder flow={flow} onSubmit={performLogin} style={styles.loginForm} />

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

          <HoliHeading level="2" style={styles.headline2}>
            {t('auth.login.signUp.link.headline')}
          </HoliHeading>

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
  headline2: {
    marginTop: 40,
  },
  headline3: {
    marginTop: 16,
  },
})
