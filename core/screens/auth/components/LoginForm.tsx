import { useApolloClient } from '@apollo/client/react'
import { LoginFlowActiveEnum, LoginFlowState, type LoginFlow, type UpdateLoginFlowBody } from '@ory/kratos-client'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'

import { doBrowserLogin, doLogin, hasIdentifier, initLoginFlow, submitLoginFlow } from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError, isUnverifiedUserError } from '@holi/core/auth/helpers/form'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { useLoginState } from '@holi/core/auth/loginState'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { TrackingEvent } from '@holi/core/tracking'
import { usePathToRedirect, useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { getBrowserRedirect } from '@holi/core/auth/helpers/helper'
import { HoliLoginCancelledError } from '@holi/core/errors/classes/HoliLoginCancelledError'
import { Spacing } from 'holi-bricks/foundations'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { Key2 } from '@holi/icons/src/generated'
import { Text } from 'holi-bricks/components/text'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { getRedirectAfterSocialLogin } from '@holi/core/screens/spaces/tasks/helpers'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import type { AuthenticationStep } from '@holi/core/screens/auth/helpers/authenticationStep'
import { useOtpLoginForm } from '@holi/core/screens/auth/form/hooks/useOtpLoginForm'
import { EmailOtpForm } from '@holi/core/screens/auth/form/components/EmailOtpForm'
import { CodeOtpForm } from '@holi/core/screens/auth/form/components/CodeOtpForm'
import { EmailPasswordForm } from '@holi/core/screens/auth/form/components/EmailPasswordForm'
import { usePasswordLoginForm } from '@holi/core/screens/auth/form/hooks/usePasswordLoginForm'
import { useSocialLoginForm } from '@holi/core/screens/auth/form/hooks/useSocialLoginForm'
import { SocialLoginForm } from '@holi/core/screens/auth/form/components/SocialLoginForm'

interface LoginFormProps {
  startedFlowId?: string
  onLogin?: () => void
  step: AuthenticationStep
  setStep: React.Dispatch<React.SetStateAction<AuthenticationStep>>
}

export const LoginForm = ({ startedFlowId, onLogin, step, setStep }: LoginFormProps) => {
  const { isLoggedOut } = useLoginState()
  const [flow, setFlow] = useState<LoginFlow | undefined>(undefined)
  const safeSetFlow = useSafeDispatch(setFlow)
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const client = useApolloClient()
  const redirect = useRedirect('/')
  const { navigate } = useRouting()
  const { styles } = useStyles(stylesheet)
  const pathToRedirect = usePathToRedirect()

  const updateStep = useCallback(
    (flow: LoginFlow) => {
      // TODO(SF) move to helper?
      if (flow?.active === LoginFlowActiveEnum.Code && flow?.state === LoginFlowState.SentEmail && step !== 'code') {
        setStep('code')
      } else if (flow?.active === LoginFlowActiveEnum.Password && step !== 'email-password') {
        setStep('email-password')
      } else if (step !== 'start') {
        setStep('start')
      }
    },
    [step, setStep]
  )

  // TODO(SF) handle global messages on flow updates, see FormBuilder
  const handleMessage = useCallback(
    (messageId: number) => {
      // Not displaying info message that an OTP code was sent via e-mail, as it's displayed using text on the screen instead.
      if (messageId === 1010014) {
        if (step === 'start') {
          setStep('code')
        }
        return true
      }
      return false
    },
    [step, setStep]
  )

  const initializeFlow = useCallback(
    (flowId?: string) =>
      initLoginFlow(flowId)
        .then(safeSetFlow)
        .then(updateStep)
        .catch((error) =>
          displayError(error, 'Failed to initialize login flow', {
            displayMessage: t('auth.login.error.initialization'),
            location: 'Login.initializeFlow',
          })
        ),
    [t, safeSetFlow, displayError]
  )

  useEffect(() => {
    // TODO(SF) merge with other flow handling
    if (flow?.ui?.messages?.find((message) => message.id === 4000007 || message.id === 1010016)) {
      displayError(new Error('Email already used'), 'Failed to submit login form', {
        displayMessage: t('auth.login.message.1010016'),
        location: 'LoginForm.useEffect',
      })

      initializeFlow()
    } else if (isLoggedOut && !flow) {
      initializeFlow(startedFlowId)
    } else if (!isLoggedOut) {
      const redirect = getRedirectAfterSocialLogin()
      navigate(redirect || pathToRedirect || '/')
    }
  }, [isLoggedOut, initializeFlow, flow, startedFlowId, navigate, displayError, t, pathToRedirect])

  const performLogin = async (payload: UpdateLoginFlowBody, provider?: string) => {
    if (!flow) {
      return
    }
    try {
      const { data }: { data: OrySessionContext } = await submitLoginFlow(flow, payload, provider, undefined)
      await doLogin(client, data)
      onLogin?.()
      storeOnboardingState('finished')
      redirect(true)
    } catch (err) {
      if (
        (
          err as { response?: { data?: { ui?: { messages?: { id?: number }[] } } } }
        )?.response?.data?.ui?.messages?.find((message) => message.id === 4000007 || message.id === 1010016)
      ) {
        displayError(err, 'Failed to submit login form as e-mail is already used', {
          displayMessage: t('auth.login.message.1010016'),
          location: 'LoginForm.performLogin',
        })
        initializeFlow()
        return
      }
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
    }
  }

  // @ts-ignore TODO(SF) fix typecheck
  const socialLoginFormProps = useSocialLoginForm({ flow, performLogin })
  // @ts-ignore TODO(SF) fix typecheck
  const otpFormProps = useOtpLoginForm({ flow, performLogin, resetFlow: initializeFlow })
  // @ts-ignore TODO(SF) fix typecheck
  const passwordFormProps = usePasswordLoginForm({ flow, performLogin })

  return (
    // TODO(SF) form style
    <View>
      {step === 'code' && <CodeOtpForm {...otpFormProps} />}
      {step === 'email-password' && <EmailPasswordForm {...passwordFormProps} />}
      {step === 'start' && (
        <>
          <SocialLoginForm {...socialLoginFormProps} />

          <View style={styles.dividerContainer}>
            <View style={styles.divider}>
              <HoliDivider />
            </View>
            <View style={styles.dividerContainer}>
              <Text textAlign="center" color="greyDark">
                {t('auth.divider.email')}
              </Text>
            </View>
            <View style={styles.divider}>
              <HoliDivider />
            </View>
          </View>

          <EmailOtpForm {...otpFormProps} />

          <ButtonTracked
            label={t('auth.CTA.emailPassword')}
            testID="btn-to-email-password-form"
            variant="secondary"
            size="lg"
            onPress={() => setStep('email-password')}
            icon={Key2}
            trackingEvent={TrackingEvent.Auth.HoliLoginPressed({
              method: 'email',
              screen: 'mainLogin',
            })}
          />
        </>
      )}
    </View>
  )
}

const stylesheet = createStyleSheet({
  form: {
    marginTop: Spacing.sm,
    width: '100%',
  },
  formItemContainer: {
    marginTop: Spacing.sm,
  },
  mailImage: {
    marginTop: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  changeEmailContainer: {
    gap: Spacing['3xs'],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dividerContainer: {
    marginTop: Spacing['3xs'],
    marginBottom: Spacing['3xs'],
    gap: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  divider: {
    flex: 1,
  },
})
