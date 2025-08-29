import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'
import { useLoginState } from '@holi/core/auth/loginState'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import { clearProcessingUnauthorizedLogout } from '@holi/core/components/SessionExpiryProtection'
import { useLogout } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const ForceLogout = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()
  const { logout, isLoggingOut } = useLogout()
  const { isUnknown, isLoggedIn } = useLoginState()

  useEffect(() => {
    if (isLoggedIn || isUnknown) {
      if (!isLoggingOut) {
        logout({
          message: t('auth.loggingOut'),
          skipLogoutFlow: true,
          redirectPath: '/profile',
          redirectTimeout: 3000,
        }).finally(clearProcessingUnauthorizedLogout)
      }
    } else {
      navigate('/profile')
    }
  }, [t, navigate, logout, isLoggingOut, isLoggedIn, isUnknown])

  return (
    <DefaultLayout>
      <View style={[mixins.container, styles.messageContainer]}>
        <HoliText>{t('auth.loggingOut')}</HoliText>
      </View>
    </DefaultLayout>
  )
}

const styles = StyleSheet.create({
  messageContainer: {
    alignItems: 'center',
    marginTop: dimensions.topBarHeight + 50,
  },
})

export default ForceLogout
