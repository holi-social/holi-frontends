import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import { useScrollYHandler } from '@holi/core/helpers'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import LoggedOutView from '@holi/core/screens/userprofile/components/LoggedOutView'
import SettingsItem from '@holi/core/screens/userprofile/components/SettingsItem'
import type { BottomTabsScreens } from '@holi/mobile/navigation/RootNavigator'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<BottomTabsScreens>

const AccountSettings: React.VFC<ScreenProps> = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { setOptions, navigate } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()

  useLayoutEffect(() => setOptions({ title: t('profile.settings.account.title') }), [setOptions, t])

  return (
    <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200}>
      <LoginProtection loggedOutContent={<LoggedOutView />}>
        <View style={[mixins.container, styles.accountSettings]}>
          <SettingsItem
            label={t('profile.edit.changePassword')}
            icon="key-2"
            onPress={() => navigate('/forgotPassword')}
          />
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
