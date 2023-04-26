import { VerificationFlow } from '@ory/kratos-client'
import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, StyleSheet } from 'react-native'

import HoliLoader, { useLoader } from '@holi//ui/components/molecules/HoliLoader'
import HoliTextInput from '@holi//ui/components/molecules/HoliTextInput'
import CenteredImageHeadlineDescriptionLayout from '@holi/core/auth/components/CenteredImageHeadlineDescriptionLayout'
import { getOrCreateVerificationFlow, submitVerificationFlow } from '@holi/core/auth/helpers/auth'
import { useVerificationFlowData } from '@holi/core/auth/helpers/useVerificationFlowData'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLogout } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting/useRouting'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliTextLink from '@holi/ui/components/atoms/HoliTextLink'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliKeyboardSaveView from '@holi/ui/components/organisms/HoliKeyboardSaveView'
import { useScrollToInputOnFocus } from '@holi/ui/helper/useScrollToInputOnFocus'
import { colors, vars } from '@holi/ui/styles/globalVars'

const CODE_MAX_COUNT = 6

export interface EmailVerificationProps {
  onDismiss: () => void
  onSuccess: () => void
}

const EmailVerification = ({ onDismiss, onSuccess }: EmailVerificationProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { displayError } = useErrorHandling()
  const { isLoaderShown, showLoader, hideLoader } = useLoader()
  const { logout } = useLogout()

  const [code, setCode] = useState('')

  const scrollViewRef = useRef<ScrollView>(null)
  const scrollToInputWithId = useScrollToInputOnFocus(scrollViewRef)

  const verificationFlowData = useVerificationFlowData()
  const [flow, setFlow] = useState<VerificationFlow | undefined>(undefined)

  // get verification flow from Ory
  useEffect(() => {
    getOrCreateVerificationFlow(verificationFlowData).then((verificationFlow) => {
      // finish Onboarding if no flow available
      if (!verificationFlow) {
        onDismiss()
        logout({
          afterLoggedOut: () => {
            /* do nothing, override default redirect to `/profile` page */
          },
        })
        return
      }

      setFlow(verificationFlow)
    })
  }, [logout, onDismiss, verificationFlowData])

  return (
    <HoliKeyboardSaveView>
      <CenteredImageHeadlineDescriptionLayout
        imageSource={require('@holi/ui/assets/img/illustrations/registration_email_verification.svg')}
        imageLabelText={t('registration.emailVerification.activateAccount')}
        headlineText={t('registration.emailVerification.heading')}
        descriptionText={t('registration.emailVerification.description')}
        ref={scrollViewRef}
      >
        <HoliBox padding={[32, 0, 0, 0]} layout={styles.limitedBox} />
        <HoliTextInput
          value={code}
          onChange={setCode}
          placeholder={t('registration.emailVerification.inputPlaceholder')}
          accessibilityLabel={t('registration.emailVerification.inputLabel')}
          maxNoOfCharacters={CODE_MAX_COUNT}
          showCharacterCount
          inputProps={{
            keyboardType: 'numeric',
          }}
          style={[styles.limitedBox, { alignSelf: 'center' }]}
          {...scrollToInputWithId('code')}
        />

        <HoliBox padding={[16, 0, 0, 0]}>
          <HoliTextLink
            label={t('registration.emailVerification.resendEmail')}
            href="/"
            onPress={() => {
              // TODO: Resend Email logic
              return false
            }}
            variant="secondary"
            size="small"
          >
            {t('registration.emailVerification.resendEmail')}
          </HoliTextLink>
        </HoliBox>

        <HoliBox padding={[24, 0, 0, 0]} layout={styles.limitedBox}>
          <HoliButton
            label={t('registration.emailVerification.activateAccount')}
            disabled={code.length !== CODE_MAX_COUNT}
            onPress={async () => {
              if (!flow) return

              showLoader()

              try {
                const {
                  ui: { messages },
                  state,
                } = await submitVerificationFlow({ flow, code })

                if (state === 'passed_challenge') {
                  onSuccess()
                } else if (state === 'sent_email') {
                  messages?.forEach(({ id }) => {
                    switch (id) {
                      case 4070006:
                        displayError(new Error(id.toString()), 'Wrong verification code')
                        setCode('')
                        break

                      default:
                        break
                    }
                  })
                }
              } catch (err) {
                // TODO: error handling
                // handleFormSubmitError(
                //   setFlow,
                //   () => getVerificationFlow(verificationFlowId),
                //   (error) => displayError(error, t('auth.login.error.login')),
                //   err
                // )
              } finally {
                hideLoader()
              }
            }}
            type="primary"
            testID="btn-submit-code"
          >
            {t('registration.emailVerification.activateAccount')}
          </HoliButton>
        </HoliBox>

        <HoliBox padding={[24, 0, 0, 0]} layout={styles.limitedBox}>
          <HoliButton
            label={t('auth.loginProtection.continueAsGuest')}
            onPress={() => {
              onDismiss?.()
              navigate('/')
            }}
            type="secondary"
            testID="btn-to-continue-as-guest"
          >
            {t('auth.loginProtection.continueAsGuest')}
          </HoliButton>
        </HoliBox>

        {isLoaderShown && <HoliLoader />}
      </CenteredImageHeadlineDescriptionLayout>
    </HoliKeyboardSaveView>
  )
}

const styles = StyleSheet.create({
  inner: {
    alignItems: 'center',
    maxWidth: vars.breakpointL,
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
    color: colors.foreground20,
    marginTop: 16,
    textAlign: 'center',
  },
  limitedBox: {
    maxWidth: vars.breakpointS,
    width: '100%',
  },
})

export default EmailVerification
