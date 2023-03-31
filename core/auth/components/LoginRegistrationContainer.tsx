import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useLoggedInUser } from '@holi/core/screens/userprofile/UserContextProvider'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

interface LoginRegistrationContainerProps {
  style?: StyleProp<ViewStyle>
}

const LoginRegistrationContainer = ({ children, style }: React.PropsWithChildren<LoginRegistrationContainerProps>) => {
  const { isLoggedIn, isLoading } = useLoggedInUser()
  const { t } = useTranslation()
  const { navigate } = useRouting()

  useLayoutEffect(() => {
    isLoggedIn && navigate('/profile')
  }, [isLoggedIn, navigate])

  if (isLoading) return <HoliLoader />

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
