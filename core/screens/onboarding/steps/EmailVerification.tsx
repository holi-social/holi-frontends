import { useApolloClient } from '@apollo/client'
import type { VerificationFlow } from '@ory/kratos-client'
import React, { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import CenteredImageHeadlineDescriptionLayout from '@holi/core/auth/components/CenteredImageHeadlineDescriptionLayout'
import { getOrCreateVerificationFlow, hasIdentifier, login, submitVerificationFlow } from '@holi/core/auth/helpers/auth'
import type { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { clearVerificationFlowData, useVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { setLoginStateLoggedIn, useLoginState } from '@holi/core/auth/loginState'
import { HoliButtonLoadingTracked, TextLinkTracked } from '@holi/core/components/Trackable'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLogout } from '@holi/core/helpers'
import { TrackingEvent } from '@holi/core/tracking'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { storeOnboardingState } from '@holi/core/screens/onboarding/hooks/onboardingState'
import { storeGuestMode } from '@holi/core/screens/onboarding/helpers/guestModeStorage'

const CODE_MAX_COUNT = 6

export interface EmailVerificationProps {
  onDismiss?: () => void
  onSuccess: () => void
  testID?: string
}

export const EmailVerification = ({
  onDismiss = () => null,
  onSuccess,
  testID = 'email-verification',
}: EmailVerificationProps) => {
  const { t } = useTranslation()
  const { displayError } = useErrorHandling()
  const { isLoaderShown, showLoader, hideLoader } = useLoader()
  const { isLoggedIn } = useLoginState()
  const { logout } = useLogout()
  const { openToast } = useToast()
  const client = useApolloClient()

  const [code, setCode] = useState('')

  const verificationFlowData = useVerificationFlowData()
  const [flow, setFlow] = useState<VerificationFlow | undefined>(undefined)
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  // get verification flow from Ory
  useEffect(() => {
    if (!verificationFlowData) {
      return
    } else if (verificationFlowData === 'verification-disabled') {
      // Email Verification is disabled in Ory: skip EmailVerification step
      clearVerificationFlowData()
      onSuccess()
    } else {
      showLoader()
      // Email verification is enabled in Ory
      getOrCreateVerificationFlow(verificationFlowData)
        .then(setFlow)
        .catch((error) => {
          displayError(error, 'Failed to retrieve email verification flow', {
            location: 'EmailVerification.getOrCreateVerificationFlow',
          })

          if (isLoggedIn) logout({ skipRedirect: true, showToastAfter: false })
          onDismiss()
        })
        .finally(hideLoader)
    }
    // do only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resendEmail = async () => {
    if (!verificationFlowData || typeof verificationFlowData !== 'object' || !flow) return false

    try {
      const email = hasIdentifier(verificationFlowData)
        ? verificationFlowData.identifier
        : 'verifiable_address' in verificationFlowData
          ? verificationFlowData.verifiable_address
          : ''

      await submitVerificationFlow({ flow, email })
      openToast(t('registration.emailVerification.message.emailResent'), HoliToastType.SUCCESS)
    } catch (error) {
      displayError(error, 'Failed to resend email for verification flow', {
        displayMessage: t('registration.emailVerification.message.emailResent.error'),
        location: 'EmailVerification.resendEmail',
      })
    }

    // prevent HoliTextLink default behaviour
    return false
  }

  const handleSuccessfulVerification = async (
    toastMessage: string = t('registration.emailVerification.message.activated')
  ) => {
    // if we came to Email Verification from Login page, login the user after successful activation
    if (
      !isLoggedIn &&
      verificationFlowData &&
      typeof verificationFlowData === 'object' &&
      hasIdentifier(verificationFlowData)
    ) {
      const session = await login({
        payload: verificationFlowData,
      })
      storeOnboardingState('accountSetup')
      await client.clearStore()
      await setLoginStateLoggedIn(session as OrySessionContext)
    } else {
      storeOnboardingState('accountSetup')
    }

    openToast(toastMessage, HoliToastType.SUCCESS)
    clearVerificationFlowData()
    onSuccess()
  }

  const verifyEmail = async () => {
    if (!flow) return

    try {
      showLoader()
      const {
        ui: { messages },
        state,
      } = await submitVerificationFlow({ flow, code })

      // on successful email verification
      if (state === 'passed_challenge') {
        await handleSuccessfulVerification()
      } else if (state === 'sent_email') {
        // on email verification error
        messages?.forEach(async ({ id }) => {
          switch (id) {
            case 4070001:
            case 4070003:
              openToast(t('registration.emailVerification.message.cannotActivate'), HoliToastType.ERROR)
              break

            case 4070002:
              await handleSuccessfulVerification(t('registration.emailVerification.message.alreadyActivated'))
              break

            case 4070005:
              openToast(t('registration.emailVerification.message.flowExpired'), HoliToastType.ERROR)
              break

            case 4070006:
              openToast(t('registration.emailVerification.message.invalidCode'), HoliToastType.ERROR)
              break

            default:
              break
          }
        })
        setCode('')
      }
    } catch (error) {
      displayError(error, 'Failed to submit email verification flow', {
        location: 'EmailVerification.verifyEmail',
      })
    } finally {
      hideLoader()
    }
  }

  if (!flow || !verificationFlowData) return <HoliLoader testID="loader" />

  return (
    <CenteredImageHeadlineDescriptionLayout
      imageSource={require('@holi/ui/assets/img/illustrations/registration_email_verification.svg')}
      imageLabelText={t('registration.emailVerification.activateAccount')}
      headlineText={t('registration.emailVerification.heading')}
      descriptionText={t('registration.emailVerification.description')}
      testID={testID}
      contentStyle={styles.inner}
    >
      <HoliBox padding={[32, 0, 0, 0]} layout={styles.limitedBox} />
      <HoliTextInput
        value={code}
        onChange={setCode}
        placeholder={t('registration.emailVerification.inputPlaceholder')}
        aria-label={t('registration.emailVerification.inputLabel')}
        maxNoOfCharacters={CODE_MAX_COUNT}
        showCharacterCount
        inputProps={{
          keyboardType: 'number-pad',
          inputMode: 'decimal',
          autoComplete: 'one-time-code',
        }}
        style={[styles.limitedBox, { alignSelf: 'center' }]}
        testID={`${testID}-code-input`}
      />

      <HoliBox padding={[16, 0, 0, 0]}>
        <TextLinkTracked onPress={resendEmail} size="sm" trackingEvent={TrackingEvent.Auth.ResendEmailButtonPressed}>
          {t('registration.emailVerification.resendEmail')}
        </TextLinkTracked>
      </HoliBox>

      <HoliBox padding={[24, 0, 0, 0]} layout={styles.limitedBox}>
        <HoliButtonLoadingTracked
          label={t('registration.emailVerification.activateAccount')}
          disabled={code.length !== CODE_MAX_COUNT}
          onPress={verifyEmail}
          type="primary"
          testID={`${testID}-btn-submit`}
          trackingEvent={TrackingEvent.Auth.ActivateAccountButtonPressed}
        >
          {t('registration.emailVerification.activateAccount')}
        </HoliButtonLoadingTracked>
      </HoliBox>

      <HoliBox padding={[24, 0, 0, 0]} layout={styles.limitedBox}>
        <HoliButtonLoadingTracked
          label={t('auth.loginProtection.continueAsGuest')}
          onPress={async () => {
            if (isLoggedIn) {
              await logout({ skipRedirect: true, showToastAfter: false }).catch(() => null) // ignore logout error
            }
            await storeGuestMode(true)
            clearVerificationFlowData()
            onDismiss()
          }}
          type="secondary"
          testID={`${testID}-btn-continue-as-guest`}
          trackingEvent={TrackingEvent.Auth.ContinueAsGuestButtonPressed}
        >
          {t('auth.loginProtection.continueAsGuest')}
        </HoliButtonLoadingTracked>
      </HoliBox>

      {isLoaderShown && <HoliLoader />}
    </CenteredImageHeadlineDescriptionLayout>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    inner: {
      alignItems: 'center',
      width: '100%',
    },
    imageContainer: {
      alignItems: 'center',
    },
    headline: {
      fontWeight: '400',
      textAlign: 'center',
      marginTop: 64,
    },
    description: {
      color: theme.colors.foreground20,
      marginTop: 16,
      textAlign: 'center',
    },
    limitedBox: {
      width: '100%',
    },
  })
