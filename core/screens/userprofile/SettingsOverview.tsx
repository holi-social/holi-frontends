import React, { memo, useCallback, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import { useLogout } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import HoliConfirmation, { useConfirmationState } from '@holi/ui/components/molecules/HoliConfirmation'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const SettingsOverview = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const mixins = useStyleMixins()
  const { setOptions } = useUnifiedNavigation()
  const { logout, isLoggingOut } = useLogout()
  const { setShow: setShowLogoutConfirmation, props: logoutConfirmationProps } = useConfirmationState({
    onConfirm: () => {
      logout()
    },
  })

  useLayoutEffect(() => setOptions({ title: t('profile.settings.overview.title') }), [setOptions, t])

  const goTo = useCallback(
    (url: string) => () => {
      navigate(url)
    },
    [navigate]
  )

  // TODO: remove after implementing the feature
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()

  return (
    <ScrollHeaderLayout.Defatult>
      <LoginProtection>
        <View style={[mixins.container, styles.settingsOverview]}>
          <MoreOptionItem
            label={t('profile.settings.account.title')}
            icon="account-circle"
            iconRight="arrow"
            onPress={goTo('/profile/settings/account')}
            style={styles.settingsItem}
            testID="btn-your-account"
          />
          <MoreOptionItem
            label={t('notifications.title')}
            icon="notification-2"
            iconRight="arrow"
            onPress={showFeatureNotImplementedToast}
            tintColor={colors.foreground20}
            style={styles.settingsItem}
          />
          {/* testing mailto links will fail on emulators - see https://github.com/expo/expo/issues/7817 */}
          <MoreOptionItem
            label={t('profile.settings.overview.help')}
            icon="help"
            iconRight="outlink"
            onPress={() => Linking.openURL(t('global.support.mail.href'))}
            style={styles.settingsItem}
          />
        </View>

        <View style={styles.separator} />

        <View style={[mixins.container, styles.settingsOverview]}>
          <MoreOptionItem
            label={t('profile.logout')}
            onPress={() => setShowLogoutConfirmation(true)}
            contentStyle={styles.settingsItem}
            testID="btn-to-logout"
          />

          <HoliConfirmation
            label={t('auth.logout.button')}
            title={t('auth.logout.button')}
            description={t('auth.logout.heading')}
            dismissText={t('auth.logout.confirmation.dismiss')}
            confirmText={t('auth.logout.confirmation.confirm')}
            confirmationButtonType="warning"
            {...logoutConfirmationProps}
            testID="modal-logout"
          />
        </View>
      </LoginProtection>

      {isLoggingOut && <HoliLoader />}
    </ScrollHeaderLayout.Defatult>
  )
}

export default memo(SettingsOverview)

const styles = StyleSheet.create({
  settingsOverview: {
    paddingHorizontal: 24,
  },
  settingsItem: {
    marginVertical: 24,
  },
  separator: {
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: colors.background30,
    height: 1,
  },
})
