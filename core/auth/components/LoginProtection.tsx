import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type LoginProtectionProps = {
  children?: React.ReactChild | React.ReactChildren
  loggedOutContent?: React.ReactChild | React.ReactChildren
}

const LoginProtection: React.VFC<LoginProtectionProps> = ({ children, loggedOutContent }: LoginProtectionProps) => {
  const { t } = useTranslation()
  const { isLoggedIn } = useContext(AuthContext)
  const { navigate } = useRouting()
  const mixins = useStyleMixins()

  if (isLoggedIn) {
    return <>{children}</>
  }

  return (
    <View style={[mixins.container, styles.loginProtection]}>
      {loggedOutContent || <Text>{t('auth.loginProtection.text')}</Text>}

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
        testID="btn-to-login-form"
      >
        {t('auth.loginProtection.registration')}
      </HoliButton>
    </View>
  )
}

const styles = StyleSheet.create({
  loginProtection: {
    alignItems: 'center',
    marginBottom: 50,
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

export default LoginProtection
