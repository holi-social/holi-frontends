import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useLogout } from '@holi/core/helpers'
import { useLoggedInUser } from '@holi/core/screens/userprofile/UserContextProvider'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const Logout: React.VFC = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { logout } = useLogout()
  const { isLoggedIn } = useLoggedInUser()

  useEffect(() => {
    if (isLoggedIn) {
      logout()
    }
  }, [logout, isLoggedIn])

  return (
    <DefaultLayout>
      <View style={[mixins.container, styles.messageContainer]}>
        <HoliText>{isLoggedIn ? t('oauth2.logout') : t('oauth2.loggedOut')}</HoliText>
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

export default Logout
