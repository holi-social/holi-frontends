import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliButton from '@holi/ui/components/HoliButton'

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
      {loggedOutContent || <Text>You’re not logged in</Text>}
      <HoliButton label="Open login form" onPress={() => navigate('/login')} style={styles.loginButton}>
        {t('auth.loginProtection.login')}
      </HoliButton>
    </View>
  )
}

export { LoginProtection }

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
