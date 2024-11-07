import { useApolloClient } from '@apollo/client'
import { VerificationFlow } from '@ory/kratos-client'
import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet } from 'react-native'

import CenteredImageHeadlineDescriptionLayout from '@holi/core/auth/components/CenteredImageHeadlineDescriptionLayout'
import { getOrCreateVerificationFlow, hasIdentifier, login, submitVerificationFlow } from '@holi/core/auth/helpers/auth'
import { OrySessionContext } from '@holi/core/auth/helpers/sdk'
import { setVerificationFlowData, useVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { setLoginStateLoggedIn, useLoginState } from '@holi/core/auth/loginState'
import { HoliButtonLoadingTracked, TextLinkTracked } from '@holi/core/components/Trackable'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLogout } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { TrackingEvent } from '@holi/core/tracking'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliLoader, { useLoader } from '@holi/ui/components/molecules/HoliLoader'
import HoliTextInput from '@holi/ui/components/molecules/HoliTextInput'
import { HoliToastType, useToast } from '@holi/ui/components/molecules/HoliToastProvider'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const CODE_MAX_COUNT = 6

export interface EmailVerificationProps {
  onDismiss?: () => void
  onSuccess: () => void
}

const EmailVerification = ({ onDismiss = () => null, onSuccess }: EmailVerificationProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { displayError } = useErrorHandling()
  const { isLoaderShown, showLoader, hideLoader } = useLoader()
  const { isLoggedIn } = useLoginState()
  const { logout } = useLogout()
  const { openToast } = useToast()
  const client = useApolloClient()

  const [code, setCode] = useState('')

  const scrollViewRef = useRef<ScrollView>(null)
  const scrollToInputWithId = useScrollToInputOnFocus(scrollViewRef)

  const data = useVerificationFlowData()
  const verificationFlowData = typeof data === 'object' ? data : undefined
  const [flow, setFlow] = useState<VerificationFlow | undefined>(undefined)
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  // get verification flow from Ory
  useEffect(() => {
    if (data === 'verification-disabled') {
      // disabled verification in Ory: skip EmailVerification step
      onSuccess()
    } else {
      showLoader()
      // enabled verification in Ory
      getOrCreateVerificationFlow(verificationFlowData)
        .then(setFlow)
        .catch((error) => {
          displayError(error, 'Failed to retrieve email verification flow', {
            location: 'EmailVerification.getOrCreateVerificationFlow',
          })

          isLoggedIn ? logout({ redirectPath: '/', showToastAfter: false }) : navigate('/')
          onDismiss()
        })
        .finally(hideLoader)
    }
    // do only once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resendEmail = async () => {
    if (!verificationFlowData || !flow) return false

    try {
      const email =
        typeof verificationFlowData === 'object' && hasIdentifier(verificationFlowData)
          ? verificationFlowData.identifier
          : verificationFlowData.verifiable_address

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
    if (!isLoggedIn && verificationFlowData && hasIdentifier(verificationFlowData)) {
      const session = await login({
        payload: verificationFlowData,
      })
      await client.clearStore()
      await setLoginStateLoggedIn(session as OrySessionContext)
    }

    openToast(toastMessage, HoliToastType.SUCCESS)
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

  if (!flow) return <HoliLoader />

  return (
    <HoliKeyboardSaveView>
      <CenteredImageHeadlineDescriptionLayout
        imageSource={require('@holi/ui/assets/img/illustrations/registration_email_verification.svg')}
        imageLabelText={t('registration.emailVerification.activateAccount')}
        headlineText={t('registration.emailVerification.heading')}
        descriptionText={t('registration.emailVerification.description')}
        testID="email-verification"
        ref={scrollViewRef}
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
          testID="email-verification-code"
          {...scrollToInputWithId('code')}
        />

        <HoliBox padding={[16, 0, 0, 0]}>
          <TextLinkTracked
            onPress={resendEmail}
            size="sm"
            trackingEvent={TrackingEvent.Auth.ResendEmailButtonPressed}
            role="link"
          >
            {t('registration.emailVerification.resendEmail')}
          </TextLinkTracked>
        </HoliBox>

        <HoliBox padding={[24, 0, 0, 0]} layout={styles.limitedBox}>
          <HoliButtonLoadingTracked
            label={t('registration.emailVerification.activateAccount')}
            disabled={code.length !== CODE_MAX_COUNT}
            onPress={verifyEmail}
            type="primary"
            testID="btn-submit-code"
            trackingEvent={TrackingEvent.Auth.ActivateAccountButtonPressed}
          >
            {t('registration.emailVerification.activateAccount')}
          </HoliButtonLoadingTracked>
        </HoliBox>

        <HoliBox padding={[24, 0, 0, 0]} layout={styles.limitedBox}>
          <HoliButtonLoadingTracked
            label={t('auth.loginProtection.continueAsGuest')}
            onPress={async () => {
              isLoggedIn && (await logout({ redirectPath: '/', showToastAfter: false }).catch(() => null)) // ignore logout error
              onDismiss()
              navigate('/')
              setVerificationFlowData(undefined)
            }}
            type="secondary"
            testID="btn-to-continue-as-guest"
            trackingEvent={TrackingEvent.Auth.ContinueAsGuestButtonPressed}
          >
            {t('auth.loginProtection.continueAsGuest')}
          </HoliButtonLoadingTracked>
        </HoliBox>

        {isLoaderShown && <HoliLoader />}
      </CenteredImageHeadlineDescriptionLayout>
    </HoliKeyboardSaveView>
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

export default EmailVerification
