import { Text } from 'holi-bricks/components/text/Text'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useRedirect } from '@holi/core/navigation/hooks/useRedirect'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

interface LoginRegistrationContainerProps {
  style?: StyleProp<ViewStyle>
}

const LoginRegistrationContainer = ({ children, style }: React.PropsWithChildren<LoginRegistrationContainerProps>) => {
  const { isLoggedIn, isLoading } = useLoggedInUser()
  const { t } = useTranslation()
  const redirect = useRedirect('/')

  useIsomorphicLayoutEffect(() => {
    isLoggedIn && redirect(true)
  }, [isLoggedIn, redirect])

  if (isLoading) return <HoliLoader />

  return isLoggedIn ? (
    <Text size="md">{t('auth.login.alreadyLoggedIn')}</Text>
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
