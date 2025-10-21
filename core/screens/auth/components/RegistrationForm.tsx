import { useApolloClient } from '@apollo/client'
import type { RegistrationFlow, UpdateRegistrationFlowBody } from '@ory/kratos-client'
import type React from 'react'
import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Keyboard, Platform, StyleSheet, View } from 'react-native'

import FormBuilder from '@holi/core/auth/components/FormBuilder'
import {
  doBrowserLogin,
  doLogin,
  getVerificationFlowFromRegistration,
  initRegistrationFlow,
  submitRegistrationFlow,
} from '@holi/core/auth/helpers/auth'
import { handleFormSubmitError } from '@holi/core/auth/helpers/form'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { setVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { useLoginState } from '@holi/core/auth/loginState'
import { ButtonTracked } from '@holi/core/components/Trackable'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useSafeDispatch } from '@holi/core/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { TrackingEvent } from '@holi/core/tracking'
import useTracking from '@holi/core/tracking/hooks/useTracking'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import { Text } from 'holi-bricks/components/text'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { getBrowserRedirect } from '@holi/core/auth/helpers/helper'
import { HoliLoginCancelledError } from '@holi/core/errors/classes/HoliLoginCancelledError'
import { Spacing } from 'holi-bricks/foundations/dimensions/spacing'
import { Key2, Mail } from '@holi/icons/src/generated'
import { getFormNodesByStep } from '@holi/core/screens/auth/helpers/authenticationStep'
import { HoliDivider } from '@holi/ui/components/atoms/HoliDivider'
import { getTrackingEventForRegistrationFlowSubmit } from '@holi/core/auth/helpers/auth/tracking'
import { ChangeEmailButton } from '@holi/core/screens/auth/components/ChangeEmailButton'
import type { AuthenticationStep } from '@holi/core/screens/auth/helpers/authenticationStep'

const logger = getLogger('Auth')

export interface RegistrationProps {
  onRegister?: () => void
  startedFlowId?: string
  step: AuthenticationStep
  setStep: React.Dispatch<React.SetStateAction<AuthenticationStep>>
}

export const RegistrationForm = ({ onRegister, startedFlowId, step, setStep }: RegistrationProps) => {
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
    [step, setStep]
  )

  const initializeFlow = useCallback(
    (flowId?: string) => {
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
              location: 'RegistrationForm.initRegistrationFlow',
            })
          )
      )
    },
    [isLoggedOut, safeSetFlow, displayError, t]
  )

  // When the component is mounted, we initialize a new use registration flow:
  useIsomorphicLayoutEffect(() => {
    initializeFlow(startedFlowId)
  }, [initializeFlow, startedFlowId])

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
        const { data } = await submitRegistrationFlow(flow, payload, provider)
        logger.debug('RegistrationForm.onSubmit', 'registration was successful')

        const verificationFlowData = getVerificationFlowFromRegistration(data)
        logger.debug(
          'RegistrationForm.getVerificationFlowFromRegistration',
          'verification flow data',
          verificationFlowData
        )
        setVerificationFlowData(verificationFlowData)

        await doLogin(client, {
          session: data.session,
          session_token: data.session_token,
        } as OrySessionContext)

        logger.debug('RegistrationForm.onSubmit', 'login after registration was successful')

        onRegister?.()
      } catch (err) {
        logger.debug('RegistrationForm.onSubmit', 'Error', err)
        if (
          (
            err as { response?: { data?: { ui?: { messages?: { id?: number }[] } } } }
          )?.response?.data?.ui?.messages?.find((message) => message.id && [4000007, 4010003].includes(message.id))
        ) {
          displayError(err, 'Failed to submit registration form as e-mail is already used', {
            displayMessage: t('auth.login.message.1010016'),
            location: 'RegistrationForm.onSubmit',
          })
          initializeFlow()?.then(() => {
            setStep('oidc')
          })
          return
        }
        if (err instanceof HoliLoginCancelledError) {
          // Do not display error if user cancelled the login
          return
        }
        const url = getBrowserRedirect(err)
        logger.debug('RegistrationForm.onSubmit', 'Browser redirect URL', url)
        if (url) {
          if (Platform.OS === 'web') {
            navigate(url)
          } else {
            const data = await doBrowserLogin(url, flow).catch((error) => {
              logger.debug('RegistrationForm.doBrowserLogin', 'Error', error)
              handleFormSubmitError(
                safeSetFlow,
                initializeFlow,
                (err) =>
                  displayError(err, 'Failed to login user', {
                    displayMessage: t('auth.login.error.login'),
                    location: 'RegistrationForm.doBrowserLogin',
                  }),
                error
              )
            })
            if (data) {
              await doLogin(client, data)
              onRegister?.()
            }
          }
        } else {
          handleFormSubmitError(
            safeSetFlow,
            initializeFlow,
            (error) =>
              displayError(error, 'Failed to submit form', {
                displayMessage: t('auth.registration.error.registration'),
                location: 'RegistrationForm.handleFormSubmitError',
              }),
            err
          )
        }
      } finally {
        hideLoader()
      }
    }
  }

  const nodesToShow = getFormNodesByStep(step)

  return (
    <View>
      {step === 'code' && (
        <ChangeEmailButton
          email={email}
          onChangeEmail={() => {
            showLoader()
            initializeFlow()?.then(() => {
              setStep('email-code')
              hideLoader()
            })
          }}
          trackingScreenName="mainRegistration"
        />
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
        </>
      )}

      {isLoaderShown && <HoliLoader testID="loader" />}
    </View>
  )
}

const styles = StyleSheet.create({
  form: {
    marginTop: Spacing.sm,
    width: '100%',
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
