import React, { memo, useCallback, useLayoutEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import { useScrollYHandler } from '@holi/core/helpers'
import { useLogout } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import LoggedOutView from '@holi/core/screens/userprofile/components/LoggedOutView'
import SettingsItem from '@holi/core/screens/userprofile/components/SettingsItem'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import HoliConfirmation from '@holi/ui/components/molecules/HoliConfirmation'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const SettingsOverview: React.VFC = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const mixins = useStyleMixins()
  const { setOptions } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()
  const [showLogoutConfirmation, setShowLogoutConfirmation] = useState(false)
  const logout = useLogout()

  useLayoutEffect(() => setOptions({ title: t('profile.settings.overview.title') }), [setOptions, t])

  const goTo = useCallback(
    (url) => () => {
      navigate(url)
    },
    [navigate]
  )

  return (
    <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200}>
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
              onPress={() => setShowLogoutConfirmation(true)}
              transparent
              testID="btn-to-logout"
            >
              <HoliText style={styles.logoutButton}>{t('profile.logout')}</HoliText>
            </HoliButton>

            <HoliConfirmation
              show={showLogoutConfirmation}
              label={t('auth.logout.button')}
              title={t('auth.logout.button')}
              description={t('auth.logout.heading')}
              onDismiss={() => setShowLogoutConfirmation(false)}
              dismissText={t('auth.logout.confirmation.dismiss')}
              confirmText={t('auth.logout.confirmation.confirm')}
              testID="modal-logout"
              onConfirm={logout}
            />
          </View>
        </>
      </LoginProtection>
    </DefaultLayout>
  )
}

export default memo(SettingsOverview)

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
