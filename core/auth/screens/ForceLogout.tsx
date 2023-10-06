import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import DefaultLayout from '@holi/core/components/DefaultLayout'
import { clearProcessingUnauthorizedLogout } from '@holi/core/components/SessionExpiryProtection'
import { useLogout } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const ForceLogout = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { navigate } = useRouting()
  const { logout, isLoggingOut } = useLogout()
  const { isLoggedIn } = useAuth()

  useEffect(() => {
    if (isLoggedIn && !isLoggingOut) {
      logout({
        message: t('auth.loggingOut'),
        skipLogoutFlow: true,
        redirectPath: '/profile',
        redirectTimeout: 3000,
      }).finally(clearProcessingUnauthorizedLogout)
    }
  }, [t, navigate, logout, isLoggingOut, isLoggedIn])

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
    marginTop: vars.topBarHeight + 50,
  },
})

export default ForceLogout
