import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

interface LoginRegistrationContainerProps {
  style?: StyleProp<ViewStyle>
}

const LoginRegistrationContainer = ({ children, style }: React.PropsWithChildren<LoginRegistrationContainerProps>) => {
  const { isLoggedIn } = useAuth()
  const { isLoading } = useLoggedInUser()
  const { t } = useTranslation()

  if (isLoading) return <HoliLoader />

  return isLoggedIn ? (
    <HoliText style={styles.viewContainer} align="center">
      {t('auth.login.alreadyLoggedIn')}
    </HoliText>
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
