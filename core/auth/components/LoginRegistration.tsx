import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import StepperContentWrapper from '@holi/core/screens/onboarding/StepperContentWrapper'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

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
  const mixins = useStyleMixins()
  headingText = headingText ?? t('profile.loggedOut.heading')

  return (
    <StepperContentWrapper style={style}>
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

      <HoliHeading level="2" size="xSmall" style={styles.loginHeadline}>
        {t('auth.registration.alreadyHasAccount')}{' '}
        <HoliButton
          transparent
          inline
          variant="small"
          label={t('auth.login')}
          style={mixins.inlineButtonFixSmall}
          onPress={() => navigate('/login')}
          testID="btn-to-login-form"
        >
          <HoliText size="small" style={styles.loginLinkText}>
            {t('auth.login')}
          </HoliText>
        </HoliButton>
      </HoliHeading>
    </StepperContentWrapper>
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
  loginLinkText: {
    color: colors.brandColorB30,
  },
})

export default LoginRegistration
