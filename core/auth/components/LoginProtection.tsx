import React, { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliButton from '@holi/ui/components/HoliButton'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

type LoginProtectionProps = {
  children?: React.ReactChild | React.ReactChildren
  loggedOutContent?: React.ReactChild | React.ReactChildren
}

const LoginProtection: React.VFC<LoginProtectionProps> = ({ children, loggedOutContent }: LoginProtectionProps) => {
  const { isLoggedIn } = useContext(AuthContext)
  const { navigate } = useRouting()

  const { theme } = useTheme()
  const styles = getStyles(theme)

  if (isLoggedIn) {
    return <>{children}</>
  }

  return (
    <View style={styles.loginProtection}>
      {loggedOutContent || <Text>You’re not logged in</Text>}
      <HoliButton label="Open login form" onPress={() => navigate('/login')} style={styles.loginButton}>
        Log in
      </HoliButton>
    </View>
  )
}

export { LoginProtection }

const getStyles = (theme: HoliTheme) =>
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
