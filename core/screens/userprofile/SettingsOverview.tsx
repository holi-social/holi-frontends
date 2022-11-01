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
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<HomeStackScreens>

const SettingsOverview: React.VFC<ScreenProps> = ({ navigation }) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const mixins = useStyleMixins()

  useNavigationHeader(navigation, { title: t('profile.settings.overview.title'), headerLeft: () => <BackButton /> })

  const goTo = useCallback(
    (url) => () => {
      navigate(url)
    },
    [navigate]
  )

  return (
    <DefaultLayout>
      <LoginProtection loggedOutContent={<LoggedOutView />}>
        <>
          <View style={[mixins.container, styles.settingsOverview]}>
            <SettingsItem
              label={t('profile.settings.account.title')}
              icon="account-circle"
              onPress={goTo('/profile/settings/account')}
            />
            <SettingsItem label={t('notifications.title')} icon="notification-2" />
            <SettingsItem label={t('help.title')} icon="help" />
          </View>

          <View style={styles.separator} />

          <View style={mixins.container}>
            <HoliButton
              label={t('profile.logout')}
              inline
              onPress={() => navigate('/logout')}
              transparent
              testID="btn-to-logout"
            >
              <HoliText style={styles.logoutButton}>{t('profile.logout')}</HoliText>
            </HoliButton>
          </View>
        </>
      </LoginProtection>
    </DefaultLayout>
  )
}

export default SettingsOverview

const styles = StyleSheet.create({
  settingsOverview: {
    paddingHorizontal: 30,
  },
  separator: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.borderColorGrey,
    marginTop: -9,
    marginBottom: 14,
    height: 10,
  },
  logoutButton: {
    margin: 10,
    color: colors.fontColorError,
  },
})
