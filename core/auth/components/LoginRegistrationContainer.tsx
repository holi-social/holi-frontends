import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliText from '@holi/ui/components/atoms/HoliText'

interface LoginRegistrationContainerProps {
  style?: StyleProp<ViewStyle>
}

const LoginRegistrationContainer = ({ children, style }: React.PropsWithChildren<LoginRegistrationContainerProps>) => {
  const { isLoggedIn } = useAuth()
  const { t } = useTranslation()
  const { navigate } = useRouting()

  useLayoutEffect(() => {
    if (!isLoggedIn) {
      return
    }
    console.log('#### [LoginRegistrationContainer] already logged in -> go to profile ... ????!')
    // navigate('/profile')
  }, [isLoggedIn, navigate])

  return isLoggedIn ? (
    <HoliText>{t('auth.login.alreadyLoggedIn')}</HoliText>
  ) : (
    <View style={[styles.viewContainer, style]}>{children}</View>
  )
}

const styles = StyleSheet.create({
  viewContainer: {
    marginTop: Platform.select({
      native: 32,
      web: 80,
    }),
    alignSelf: 'center',
    maxWidth: 500,
    width: '100%',
    alignItems: 'center',
    ...Platform.select({
      native: {
        // enables scroll up when keyboard overlaps submit button
        paddingBottom: 500,
      },
    }),
  },
})

export default LoginRegistrationContainer
