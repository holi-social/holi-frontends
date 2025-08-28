import { useApolloClient } from '@apollo/client'
import type { LoginFlow, UpdateLoginFlowBody } from '@ory/kratos-client'
import React, { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform } from 'react-native'

import { doBrowserLogin, doLogin, hasIdentifier, initLoginFlow, submitLoginFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError, isUnverifiedUserError } from '@holi/core/auth/helpers/form'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { useLoginState } from '@holi/core/auth/loginState'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { getBrowserRedirect } from '@holi/core/auth/helpers/helper'
import createParamHooks from '@holi/core/navigation/hooks/useParam'
import { HoliLoginCancelledError } from '@holi/core/errors/classes/HoliLoginCancelledError'
import AuthScreen from '@holi/core/auth/components/AuthScreen'

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
  const { showLoader, hideLoader } = useLoader()
  const client = useApolloClient()
  const { track } = useTracking()
  const redirect = useRedirect('/')
  const { navigate } = useRouting()
  const [flowId] = useParam('flow')
  const [step, setStep] = useState<'oidc' | 'email-password' | 'email-code' | 'code'>('oidc')

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
    console.log('performLogin', payload, provider)
    // TODO(SF) differentiate buttons when tracking: if (payload.method === 'code') / if (!!payload.code)
    track(provider ? TrackingEvent.Auth.SocialLoginButtonPressed(provider) : TrackingEvent.Auth.LoginButtonPressed)
    if (!flow) return

    showLoader()

    try {
      const { data }: { data: OrySessionContext } = await submitLoginFlow(flow, payload, provider, undefined)
      await doLogin(client, data)
      storeOnboardingState('finished')
      redirect(true)
      if (payload.method === 'code' && step === 'email-code') {
        setStep('code')
      }
    } catch (err) {
      console.log('err', err)
      if (err instanceof HoliLoginCancelledError) {
        // Do not display error if user cancelled the login
        return
      }
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

  return <AuthScreen flowId={flowId} onSubmit={performLogin} isSignin step={step} setStep={setStep} />
}

export default memo(Login)
