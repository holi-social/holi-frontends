import React, { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import BackButton from '@holi/core/navigation/components/BackButton'
import useNavigationHeader from '@holi/core/navigation/hooks/useNavigationHeader'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import LoggedOutView from '@holi/core/screens/userprofile/components/LoggedOutView'
import SettingsItem from '@holi/core/screens/userprofile/components/SettingsItem'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const AccountSettings: React.VFC<ScreenProps> = ({ navigation }) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const mixins = useStyleMixins()

  useNavigationHeader(navigation, { title: t('profile.settings.account.title'), headerLeft: () => <BackButton /> })

  const goTo = useCallback(
    (url) => () => {
      navigate(url)
    },
    [navigate]
  )

  return (
    <DefaultLayout>
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

export default AccountSettings

const styles = StyleSheet.create({
  accountSettings: {
    marginTop: 50,
    paddingHorizontal: 30,
  },
})
