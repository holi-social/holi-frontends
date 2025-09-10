import { useApolloClient } from '@apollo/client'
import type { RegistrationFlow, UpdateRegistrationFlowBody } from '@ory/kratos-client'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Platform, StyleSheet, View } from 'react-native'

import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import FormBuilder from '@holi/core/auth/components/FormBuilder'
import {
  doBrowserLogin,
  doLogin,
  getVerificationFlowFromRegistration,
  initRegistrationFlow,
  retrieveSubmitFlowBody,
} from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import { newKratosSdk, type OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { useLoginState } from '@holi/core/auth/loginState'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { HoliOnboardingError } from '@holi/core/errors/classes/HoliOnboardingError'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import { useTheme } from '@holi/ui/styles/theme'
import { Text } from 'holi-bricks/components/text'
import { storeGuestMode } from '@holi/core/screens/onboarding/helpers/guestModeStorage'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { getBrowserRedirect } from '@holi/core/auth/helpers/helper'
import { HoliLoginCancelledError } from '@holi/core/errors/classes/HoliLoginCancelledError'
import { Spacing } from 'holi-bricks/foundations/dimensions/spacing'
import { Edit2, Key2, Mail } from '@holi/icons/src/generated'
import { getNodesByStep } from '@holi/core/screens/onboarding/helpers/getNodesByStep'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { testIdContinueAsGuest } from '@holi/e2e-mobile/helpers/auth'
import { getTrackingEventForRegistrationFlowSubmit } from '@holi/core/auth/helpers/auth/tracking'

const logger = getLogger('CreateAccount')

const isWeb = Platform.OS === 'web'

export interface CreateAccountProps {
  onRegister: () => void
  onContinueAsGuest: () => void
  onLogin: () => void
  testID?: string
  flowId?: string
}

export const CreateAccount = ({
  onRegister,
  onContinueAsGuest,
  onLogin,
  flowId,
  testID = 'create-account',
}: CreateAccountProps) => {
  const { navigate } = useRouting()
  const { isLoggedOut } = useLoginState()
  const [flow, setFlow] = useState<RegistrationFlow | undefined>(undefined)
  const { t } = useTranslation()
  const client = useApolloClient()
  // use safe versions of this function to prevent updating state of destroyed component
  const safeSetFlow = useSafeDispatch(setFlow)
  const { displayError } = useErrorHandling()
  const { isLoaderShown, showLoader, hideLoader } = useLoader()
  const [email, setEmail] = useState<string | undefined>(undefined)
  const [step, setStep] = useState<'oidc' | 'email-password' | 'email-code' | 'code'>('oidc')

  const { theme } = useTheme()
  const { track } = useTracking()

  const handleMessage = useCallback(
    (messageId: number) => {
      // Not displaying info message that an OTP code was sent via e-mail, as it's displayed using text on the screen instead.
      if (messageId === 1040005) {
        if (step === 'email-code') {
          setStep('code')
        }
        return true
      }
      return false
    },
    [step]
  )

  const initializeFlow = useCallback(() => {
    if (!isLoggedOut) return

    return (
      initRegistrationFlow(flowId)
        // The flow was initialized successfully, let's set the form data:
        .then(({ data: flow }) => {
          safeSetFlow(flow)
        })
        .catch((error) =>
          displayError(error, 'Failed to initialize registration flow', {
            displayMessage: t('auth.registration.error.initialization'),
            location: 'CreateAccount.initRegistrationFlow',
          })
        )
    )
  }, [isLoggedOut, flowId, safeSetFlow, displayError, t])

  // When the component is mounted, we initialize a new use login flow:
  useIsomorphicLayoutEffect(() => {
    initializeFlow()
  }, [initializeFlow])

  const onSubmit = async (
    payload: UpdateRegistrationFlowBody & { identifier?: string; 'traits.email'?: string },
    provider?: string
  ) => {
    if (payload['traits.email']) {
      setEmail(payload['traits.email'])
    }
    track(getTrackingEventForRegistrationFlowSubmit({ payload, provider, screen: 'mainRegistration' }))
    if (flow) {
      showLoader()
      Keyboard.dismiss()

      try {
        const updateRegistrationFlowBody = await retrieveSubmitFlowBody(payload, provider)
        const { data } = await newKratosSdk().updateRegistrationFlow({
          flow: flow.id,
          updateRegistrationFlowBody,
        })
        // ORY Kratos can be configured in such a way that it requires a login after
        // registration. You could handle that case by navigating to the Login screen
        // but for simplicity we'll just print an error here:
        if (isWeb ? !data.session : !data.session_token) {
          const err = new HoliOnboardingError(
            'It looks like you configured ORY Kratos to not issue a session automatically after registration. This edge-case is currently not supported in this example app. You can find more information on enabling this feature here: https://www.ory.sh/kratos/docs/next/self-service/flows/user-registration#successful-registration'
          )
          throw err
        }

        logger.debug('CreateAccount', 'registration was successful')

        const verificationFlowData = getVerificationFlowFromRegistration(data)
        setVerificationFlowData(verificationFlowData)

        await doLogin(client, {
          session: data.session,
          session_token: data.session_token,
        } as OrySessionContext)

        onRegister()
      } catch (err) {
        if (
          (
            err as { response?: { data?: { ui?: { messages?: { id?: number }[] } } } }
          )?.response?.data?.ui?.messages?.find((message) => message.id === 4000007)
        ) {
          displayError(err, 'Failed to submit form', {
            displayMessage: t('auth.login.message.1010016'),
            location: 'CreateAccount.onSubmit',
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
                    location: 'CreateAccount.doBrowserLogin',
                  }),
                error
              )
            })
            if (data) {
              await doLogin(client, data)
              onRegister()
            }
          }
        } else {
          handleFormSubmitError(
            safeSetFlow,
            initializeFlow,
            (error) =>
              displayError(error, 'Failed to submit form', {
                displayMessage: t('auth.registration.error.registration'),
                location: 'CreateAccount.onSubmit',
              }),
            err
          )
        }
      } finally {
        hideLoader()
      }
    }
  }

  const nodesToShow = getNodesByStep(step)

  return (
    <View style={styles.container}>
      <HeaderBackButton
        style={styles.backButton}
        {...(step !== 'oidc'
          ? {
              onPress: () => {
                track(TrackingEvent.Auth.HoliRegisterPressed({ method: 'back', screen: 'mainRegistration' }))
                if (step === 'email-password' || step === 'email-code') {
                  setStep('oidc')
                  // re-initialize flow to reset the form and include the oidc nodes
                  initializeFlow()
                } else if (step === 'code') {
                  showLoader()
                  initializeFlow()?.then(() => {
                    setStep('email-code')
                    hideLoader()
                  })
                }
              },
            }
          : {})}
      />
      <View style={styles.logoContainer} testID="create-account-logo">
        <HoliLogo color={theme.colors.black300} />
      </View>
      {step !== 'code' && (
        <>
          <Text headingLevel="1" size="4xl" textAlign="center">
            {t('registration.signUp.heading')}

            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/icons/give-five-filled.svg')}
              width={50}
              height={40}
              label={''}
              isSvg
            />
          </Text>
          <HoliGap size="xs" />
          <Text size="md" textAlign="center">
            {t('registration.signUp.description')}
          </Text>
        </>
      )}
      {step === 'code' && (
        <View style={styles.mailImage}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/illustrations/illustration_new_mail.svg')}
            width={251}
            height={181}
            label={t('profile.loggedOut.image')}
            isSvg
          />
          <Text size="3xl" textAlign="center">
            {t('registration.emailVerification.heading')}
          </Text>
          <Text size="md" textAlign="center">
            {t('registration.emailVerification.body')}
          </Text>
          <View style={styles.changeEmailContainer}>
            <Text size="md">{email}</Text>
            <ButtonTracked
              icon={Edit2}
              transparent
              size="lg"
              label={t('global.edit')}
              onPress={() => {
                showLoader()
                initializeFlow()?.then(() => {
                  setStep('email-code')
                  hideLoader()
                })
              }}
              trackingEvent={TrackingEvent.Auth.OneTimeCodePressed({
                step: 'edit',
                screen: 'mainRegistration',
              })}
            />
          </View>
        </View>
      )}
      <FormBuilder
        flow={flow}
        onSubmit={onSubmit}
        style={styles.form}
        nodesToShow={nodesToShow}
        handleMessage={handleMessage}
      />

      {!isLoaderShown && step === 'oidc' && (
        <>
          <View style={styles.dividerContainer}>
            <View style={styles.divider}>
              <HoliDivider />
            </View>
            <View style={styles.dividerContainer}>
              <Text size="md" textAlign="center" color="greyDark">
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
              testID={'ory-submit-email-button'}
              trackingEvent={TrackingEvent.Auth.HoliRegisterPressed({
                method: 'otp',
                screen: 'mainRegistration',
              })}
            />

            <ButtonTracked
              label={t('auth.CTA.emailPassword')}
              variant="secondary"
              size="lg"
              onPress={() => setStep('email-password')}
              icon={Key2}
              testID="btn-to-email-password-form"
              trackingEvent={TrackingEvent.Auth.HoliRegisterPressed({
                method: 'email',
                screen: 'mainRegistration',
              })}
            />
          </View>

          <View style={styles.dividerContainer}>
            <View style={styles.divider}>
              <HoliDivider />
            </View>
            <View style={styles.dividerContainer}>
              <Text size="md" textAlign="center" color="greyDark" testID={testIdContinueAsGuest}>
                {t('auth.divider.guest')}
              </Text>
            </View>
            <View style={styles.divider}>
              <HoliDivider />
            </View>
          </View>
          <ButtonTracked
            label={t('auth.loginProtection.continueAsGuest')}
            onPress={() => {
              storeGuestMode(true)
              onContinueAsGuest()
            }}
            size="lg"
            variant="secondary"
            testID={`${testID}-btn-continue-as-guest`}
            trackingEvent={TrackingEvent.Auth.ContinueAsGuestButtonPressed}
          />
        </>
      )}

      {/* Sign in only fields */}
      {!isLoaderShown && step === 'oidc' && (
        <>
          <HoliGap size="m" />
          <AlreadyHaveAccountText onPress={onLogin} trackingEvent={TrackingEvent.Auth.LoginButtonPressed} />
        </>
      )}

      {isLoaderShown && <HoliLoader testID="loader" />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.md,
  },
  backButton: {
    position: 'absolute',
    top: Spacing.md,
    left: 0,
    zIndex: 1000,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  form: {
    marginTop: Spacing.sm,
    width: '100%',
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
