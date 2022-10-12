import React, { useContext, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet, View } from 'react-native'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliText from '@holi/ui/components/atoms/HoliText'

interface LoginRegistrationContainerProps {
  children?: React.ReactChild | React.ReactChildren | Array<React.ReactChild>
}

const LoginRegistrationContainer: React.VFC<LoginRegistrationContainerProps> = ({ children }) => {
  const { userId, isLoggedIn } = useContext(AuthContext)
  const { t } = useTranslation()
  const { navigate } = useRouting()

  useLayoutEffect(() => {
    isLoggedIn && navigate('/profile')
  }, [isLoggedIn, navigate, userId])

  return (
    <>
      {isLoggedIn ? (
        <HoliText>{t('auth.login.alreadyLoggedIn')}</HoliText>
      ) : (
        <View style={styles.viewContainer}>{children}</View>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  viewContainer: {
    marginTop: 100,
    alignSelf: 'center',
    maxWidth: 500,
    width: '100%',
    paddingHorizontal: 32,
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
