import React, { memo, useCallback, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import { useScrollYHandler } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import LoggedOutView from '@holi/core/screens/userprofile/components/LoggedOutView'
import SettingsItem from '@holi/core/screens/userprofile/components/SettingsItem'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const AccountSettings: React.VFC<ScreenProps> = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const mixins = useStyleMixins()
  const { setOptions } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()

  useLayoutEffect(() => setOptions({ title: t('profile.settings.account.title') }), [setOptions, t])

  const goTo = useCallback(
    (url) => () => {
      navigate(url)
    },
    [navigate]
  )

  return (
    <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200}>
      <LoginProtection loggedOutContent={<LoggedOutView />}>
        <View style={[mixins.container, styles.accountSettings]}>
          {/* TODO: update change-password-url */}
          <SettingsItem label={t('profile.edit.changePassword')} icon="key-2" onPress={goTo('/forgotPassword')} />
          <SettingsItem label="Item 2" icon="account-circle" />
          <SettingsItem label="Item 3" icon="account-circle" />
        </View>
      </LoginProtection>
    </DefaultLayout>
  )
}

export default memo(AccountSettings)

const styles = StyleSheet.create({
  accountSettings: {
    paddingHorizontal: 30,
  },
})
