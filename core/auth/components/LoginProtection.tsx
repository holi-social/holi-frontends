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
  const { isLoggedIn } = useContext(AuthContext)
  const { navigate } = useRouting()
  const { t } = useTranslation()

  const styles = getStyles()

  if (isLoggedIn) {
    return <>{children}</>
  }

  return (
    <View style={styles.loginProtection}>
      {loggedOutContent || <Text>{t('auth.loginProtection.loggedOut')}</Text>}
      <HoliButton label={t('auth.loginProtection.login')} onPress={() => navigate('/login')} style={styles.loginButton}>
        {t('auth.loginProtection.login')}
      </HoliButton>
    </View>
  )
}

export { LoginProtection }

const getStyles = () =>
  StyleSheet.create({
    loginProtection: {
      paddingBottom: 50,
      marginBottom: 50,
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    loginButton: {
      marginTop: 50,
      width: '80%',
      alignSelf: 'center',
    },
  })
