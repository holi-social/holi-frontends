import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import AlreadyHaveAccountText from '@holi/core/auth/components/AlreadyHaveAccountText'
import CenteredContentLayout from '@holi/core/components/CenteredContentLayout'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

interface LoginRegistrationProps {
  headingText?: string
  onRegistration?: () => void
  onDismiss?: () => boolean | void
  style?: StyleProp<ViewStyle>
}

const LoginRegistration = ({
  headingText,
  onRegistration,
  onDismiss,
  style,
}: React.PropsWithChildren<LoginRegistrationProps>) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  headingText = headingText ?? t('profile.loggedOut.heading')

  return (
    <CenteredContentLayout style={style}>
      <View>
        <View style={styles.imageContainer}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/illustrations/illustration_join_holi.svg')}
            isSvg
            width={251}
            height={181}
            label={t('profile.loggedOut.image')}
          />
        </View>

        <HoliHeading level="1" size="medium" style={styles.text} testID="login-protection-heading">
          {headingText}
        </HoliHeading>
      </View>

      <HoliButton
        label={t('auth.loginProtection.registrationLabel')}
        // onPress={() => navigate('/registration')}
        onPress={onRegistration}
        style={[styles.button, styles.fistButton]}
        testID="btn-to-registration-form"
      >
        {t('auth.loginProtection.registration')}
      </HoliButton>

      <HoliButton
        label={t('auth.loginProtection.continueAsGuest')}
        onPress={() => {
          onDismiss?.() !== false && navigate('/')
        }}
        style={[styles.button, styles.secondButton]}
        type="secondary"
        testID="btn-to-continue-as-guest"
      >
        {t('auth.loginProtection.continueAsGuest')}
      </HoliButton>

      <AlreadyHaveAccountText style={styles.loginHeadline} />
    </CenteredContentLayout>
  )
}

const styles = StyleSheet.create({
  imageContainer: {
    alignItems: 'center',
  },
  text: {
    fontWeight: 400,
    textAlign: 'center',
    marginTop: 74,
  },
  button: {
    maxWidth: 300,
  },
  fistButton: {
    marginTop: 24,
  },
  secondButton: {
    marginTop: 16,
  },
  loginHeadline: {
    marginTop: 16,
    textAlign: 'center',
  },
})

export default LoginRegistration
