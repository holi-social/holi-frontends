import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

interface LoginRegistrationProps {
  style?: StyleProp<ViewStyle>
}

const LoginRegistration = ({ style }: React.PropsWithChildren<LoginRegistrationProps>) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

  return (
    <SafeAreaView style={[styles.outer, style]}>
      <View style={styles.inner}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
          <View>
            <View style={styles.moodImage}>
              <HoliLocalImage
                imageSource={require('@holi/ui/assets/img/illustrations/illustration_join_holi.svg')}
                isSvg
                width={251}
                height={181}
                label={t('profile.loggedOut.image')}
              />
            </View>

            <HoliHeading level="1" size="medium" style={styles.text} testID="user-profile-logged-out-heading">
              {t('profile.loggedOut.heading')}
            </HoliHeading>
          </View>

          <HoliButton
            label={t('auth.loginProtection.loginLabel')}
            onPress={() => navigate('/login')}
            style={[styles.button, styles.loginButton]}
            testID="btn-to-login-form"
          >
            {t('auth.loginProtection.login')}
          </HoliButton>

          <HoliButton
            label={t('auth.loginProtection.registrationLabel')}
            onPress={() => navigate('/registration')}
            style={[styles.button, styles.registrationButton]}
            type="secondary"
            testID="btn-to-registration-form"
          >
            {t('auth.loginProtection.registration')}
          </HoliButton>
        </ScrollView>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  outer: {
    ...Platform.select({
      web: { minHeight: '100%' },
      native: { flex: 1 },
    }),
    justifyContent: 'center',
  },
  inner: {
    justifyContent: 'center',
  },
  scrollView: {
    overflow: 'visible',
  },
  scrollViewContent: {
    alignItems: 'center',
    marginVertical: 20,
  },
  moodImage: {
    alignItems: 'center',
  },
  text: {
    textAlign: 'center',
    marginTop: 45,
  },
  button: {
    maxWidth: 300,
  },
  loginButton: {
    marginTop: 24,
  },
  registrationButton: {
    marginTop: 16,
  },
})

export default LoginRegistration
