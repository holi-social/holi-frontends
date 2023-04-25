import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import HoliLoader, { useLoader } from '@holi//ui/components/molecules/HoliLoader'
import HoliTextInput from '@holi//ui/components/molecules/HoliTextInput'
import CenteredImageHeadlineDescriptionLayout from '@holi/core/auth/components/CenteredImageHeadlineDescriptionLayout'
import useRouting from '@holi/core/navigation/hooks/useRouting/useRouting'
import HoliBox from '@holi/ui/components/atoms/HoliBox'
import HoliTextLink from '@holi/ui/components/atoms/HoliTextLink'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors, vars } from '@holi/ui/styles/globalVars'

const CODE_MAX_COUNT = 6

export interface EmailVerificationProps {
  code: string
  onCodeChange: (value: string) => void
  onDismiss: () => void
  onVerifyEmail: () => Promise<void>
  onResendEmail: () => void
}

const EmailVerification = ({ code, onCodeChange, onDismiss, onVerifyEmail, onResendEmail }: EmailVerificationProps) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const { isLoaderShown, showLoader, hideLoader } = useLoader()

  return (
    <CenteredImageHeadlineDescriptionLayout
      imageSource={require('@holi/ui/assets/img/illustrations/registration_email_verification.svg')}
      imageLabelText={t('registration.emailVerification.activateAccount')}
      headlineText={t('registration.emailVerification.heading')}
      descriptionText={t('registration.emailVerification.description')}
    >
      <HoliBox padding={[32, 0, 0, 0]} layout={styles.limitedBox}>
        <HoliTextInput
          value={code}
          onChange={onCodeChange}
          placeholder={t('registration.emailVerification.inputPlaceholder')}
          accessibilityLabel={t('registration.emailVerification.inputLabel')}
          maxNoOfCharacters={CODE_MAX_COUNT}
          showCharacterCount
          inputProps={{
            keyboardType: 'numeric',
          }}
        />
      </HoliBox>

      <HoliBox padding={[16, 0, 0, 0]}>
        <HoliTextLink
          label={t('registration.emailVerification.resendEmail')}
          href="/"
          onPress={() => {
            onResendEmail()
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
            showLoader()

            await onVerifyEmail()

            hideLoader()
          }}
          type="primary"
          testID="btn-to-continue-as-guest"
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
