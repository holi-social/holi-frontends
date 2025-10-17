import { useApolloClient } from '@apollo/client'
import type { LoginFlow, UpdateLoginFlowBody } from '@ory/kratos-client'
import React, { useCallback, useEffect, useState } from 'react'
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
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import { usePathToRedirect, useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { getBrowserRedirect } from '@holi/core/auth/helpers/helper'
import { HoliLoginCancelledError } from '@holi/core/errors/classes/HoliLoginCancelledError'
import { Spacing } from 'holi-bricks/foundations'
import { ButtonTracked, HoliTextLinkTracked } from '@holi/core/components/Trackable'
import { Edit2, Key2, Mail } from '@holi/icons/src/generated'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { Text } from 'holi-bricks/components/text'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { getNodesByStep } from '@holi/core/screens/onboarding/helpers/getNodesByStep'
import { getRedirectAfterSocialLogin } from '@holi/core/screens/spaces/tasks/helpers'
import { getTrackingEventForLoginFlowSubmit } from '@holi/core/auth/helpers/auth/tracking'
import { Image } from 'holi-bricks/components/image'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'

interface LoginFormProps {
  flowId?: string
  onLogin?: () => void
}

export const LoginForm = ({ flowId, onLogin }: LoginFormProps) => {
  const [displayedExistingAccountError, setDisplayedExistingAccountError] = useState(false)
  const { isLoggedOut } = useLoginState()
  const [flow, setFlow] = useState<LoginFlow | undefined>(undefined)
  const safeSetFlow = useSafeDispatch(setFlow)
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { isLoaderShown, showLoader, hideLoader } = useLoader()
  const client = useApolloClient()
  const { track } = useTracking()
  const redirect = useRedirect('/')
  const { navigate } = useRouting()
  const [email, setEmail] = useState<string | undefined>(undefined)
  const [step, setStep] = useState<'oidc' | 'email-password' | 'email-code' | 'code'>('oidc')
  const { styles } = useStyles(stylesheet)
  const pathToRedirect = usePathToRedirect()

  const handleMessage = useCallback(
    (messageId: number) => {
      // Not displaying info message that an OTP code was sent via e-mail, as it's displayed using text on the screen instead.
      if (messageId === 1010014) {
        if (step === 'email-code') {
          setStep('code')
        }
        return true
      }
      return false
    },
    [step]
  )

  const initializeFlow = useCallback(
    () =>
      initLoginFlow(flowId)
        .then(safeSetFlow)
        .catch((error) =>
          displayError(error, 'Failed to initialize login flow', {
            displayMessage: t('auth.login.error.initialization'),
            location: 'Login.initializeFlow',
          })
        ),
    [t, safeSetFlow, displayError, flowId]
  )

  useEffect(() => {
    if (
      flow?.ui?.messages?.find((message) => message.id === 4000007 || message.id === 1010016) &&
      !displayedExistingAccountError
    ) {
      displayError(new Error('Email already used'), 'Failed to submit form', {
        displayMessage: t('auth.login.message.1010016'),
        location: 'LoginForm.useEffect',
      })

      initializeFlow()?.then(() => {
        setStep('oidc')
      })
      setDisplayedExistingAccountError(true)
    }

    if (isLoggedOut && !flow) {
      initializeFlow()
    } else if (!isLoggedOut) {
      const redirect = getRedirectAfterSocialLogin()
      navigate(redirect || pathToRedirect || '/')
    }
  }, [isLoggedOut, initializeFlow, flow, navigate, displayError, t, pathToRedirect, displayedExistingAccountError])

  const performLogin = async (payload: UpdateLoginFlowBody & { identifier?: string }, provider?: string) => {
    if (payload.identifier) {
      setEmail(payload.identifier)
    }
    track(getTrackingEventForLoginFlowSubmit({ payload, provider }))
    if (!flow) return

    showLoader()

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
        displayError(err, 'Failed to submit form', {
          displayMessage: t('auth.login.message.1010016'),
          location: 'LoginForm.performLogin',
        })
        initializeFlow()?.then(() => {
          setStep('email-code')
        })
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
    } finally {
      hideLoader()
    }
  }
  const nodesToShow = getNodesByStep(step)

  return (
    <View style={styles.container}>
      <HoliContainer>
        {step === 'code' && (
          <View style={styles.mailImage}>
            <Image
              source={require('@holi/ui/assets/img/illustrations/illustration_new_mail.svg')}
              width={251}
              height={181}
              alt={t('profile.loggedOut.image')}
            />
            <Text size="3xl" textAlign="center">
              {t('registration.emailVerification.heading')}
            </Text>
            <Text textAlign="center">{t('registration.emailVerification.body')}</Text>
            <View style={styles.changeEmailContainer}>
              <Text>{email}</Text>
              <ButtonTracked
                icon={Edit2}
                transparent
                size="lg"
                label={t('global.edit')}
                onPress={() => {
                  showLoader()
                  initializeFlow().then(() => {
                    setStep('email-code')
                    hideLoader()
                  })
                }}
                trackingEvent={TrackingEvent.Auth.OneTimeCodePressed({
                  step: 'edit',
                  screen: 'mainLogin',
                })}
              />
            </View>
          </View>
        )}
        <FormBuilder
          flow={flow}
          onSubmit={performLogin}
          style={styles.form}
          nodesToShow={nodesToShow}
          handleMessage={handleMessage}
          isSignin
        />

        {!isLoaderShown && step === 'oidc' && (
          <>
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

            <View style={styles.buttonContainer}>
              <ButtonTracked
                label={t('auth.CTA.OTP')}
                variant="secondary"
                size="lg"
                onPress={() => setStep('email-code')}
                icon={Mail}
                testID="ory-submit-email-button"
                trackingEvent={TrackingEvent.Auth.HoliLoginPressed({
                  method: 'otp',
                  screen: 'mainLogin',
                })}
              />

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
            </View>
          </>
        )}

        {step === 'email-password' && (
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
        )}
      </HoliContainer>
      {isLoaderShown && <HoliLoader testID="loader" />}
    </View>
  )
}

const stylesheet = createStyleSheet({
  container: {
    flex: 1,
  },
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
  buttonContainer: {
    gap: Spacing['3xs'],
  },
})
