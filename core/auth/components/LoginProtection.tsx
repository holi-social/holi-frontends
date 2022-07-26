import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliButton from '@holi/ui/components/molecules/HoliButton'

type LoginProtectionProps = {
  children?: React.ReactChild | React.ReactChildren
  loggedOutContent?: React.ReactChild | React.ReactChildren
}

const LoginProtection: React.VFC<LoginProtectionProps> = ({ children, loggedOutContent }: LoginProtectionProps) => {
  const { t } = useTranslation()

  const { isLoggedIn } = useContext(AuthContext)
  const { navigate } = useRouting()

  if (isLoggedIn) {
    return <>{children}</>
  }

  return (
    <View style={styles.loginProtection}>
      {loggedOutContent || <Text>{t('auth.loginProtection.text')}</Text>}
      <HoliButton
        label={t('auth.loginProtection.loginLabel')}
        onPress={() => navigate('/login')}
        style={styles.loginButton}
        testID="btn-to-login-form"
      >
        {t('auth.loginProtection.login')}
      </HoliButton>
    </View>
  )
}

const styles = StyleSheet.create({
  loginProtection: {
    alignItems: 'center',
    width: '100%',
  },
  loginButton: {
    marginTop: 25,
    maxWidth: 300,
  },
})

export default LoginProtection
