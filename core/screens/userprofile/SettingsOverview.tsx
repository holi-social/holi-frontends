import { withProfiler } from '@sentry/react'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { useLogout } from '@holi/core/helpers'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import {
  AccountCircle,
  Bookmark3Line,
  FolderLock,
  Help,
  IdCard,
  Information,
  LogoutBox,
  Notification3,
  Sun,
  SunFilled,
} from '@holi/icons/src/generated'
import HoliConfirmation, { useConfirmationState } from '@holi/ui/components/molecules/HoliConfirmation'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const SettingsOverview = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const mixins = useStyleMixins()
  const [themeToggleEnabled] = useFeatureFlag(FeatureFlagKey.THEME_TOGGLE)
  const { logout, isLoggingOut } = useLogout()
  const { theme, toggleDarkMode } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const { setShow: setShowLogoutConfirmation, props: logoutConfirmationProps } = useConfirmationState({
    onPrimary: () => {
      logout({ skipRedirect: true })
    },
  })

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.overview.title') })
  }, [setScreenOptions, t])

  return (
    <ScrollView>
      <LoginProtection>
        <View style={[mixins.container, styles.settingsOverview]}>
          <MoreOptionItem
            label={t('profile.settings.account.title')}
            icon={AccountCircle}
            iconRightStyle="arrow"
            onPress={() => navigate('/profile/settings/account')}
            style={styles.settingsItem}
            testID="btn-your-account"
          />
          <MoreOptionItem
            label={t('profile.settings.notifications.title')}
            icon={Notification3}
            iconRightStyle="arrow"
            onPress={() => navigate('/profile/settings/notifications')}
            style={styles.settingsItem}
          />
          <MoreOptionItem
            label={t('profile.settings.tracking.title')}
            icon={IdCard}
            iconRightStyle="arrow"
            onPress={() => navigate('/profile/settings/tracking')}
            style={styles.settingsItem}
          />
          <MoreOptionItem
            label={t('profile.settings.favorites.title')}
            icon={Bookmark3Line}
            iconRightStyle="arrow"
            onPress={() => navigate('/profile/settings/favorites')}
            style={styles.settingsItem}
          />
          <MoreOptionItem
            label={t('profile.settings.help.title')}
            icon={Help}
            iconRightStyle="arrow"
            onPress={() => navigate('/profile/settings/help')}
            style={styles.settingsItem}
          />
          <MoreOptionItem
            label={t('profile.settings.legalDocuments.title')}
            icon={FolderLock}
            iconRightStyle="arrow"
            onPress={() => navigate('/profile/settings/legalDocuments')}
            style={styles.settingsItem}
            testID="btn-your-account"
          />
          {Platform.OS !== 'web' && (
            <MoreOptionItem
              label={t('profile.settings.aboutholiapp.title')}
              icon={Information}
              iconRightStyle="arrow"
              onPress={() => navigate('/profile/settings/aboutholiapp')}
              style={styles.settingsItem}
              testID="btn-about"
            />
          )}
          {themeToggleEnabled && (
            <MoreOptionItem
              label={t('global.theme.toggle')}
              icon={theme.dark ? Sun : SunFilled}
              onPress={toggleDarkMode}
              style={styles.settingsItem}
            />
          )}
        </View>

        <View style={styles.separator} />

        <View style={[mixins.container, styles.settingsOverview]}>
          <MoreOptionItem
            label={t('profile.logout')}
            icon={LogoutBox}
            onPress={() => setShowLogoutConfirmation(true)}
            contentStyle={styles.settingsItem}
            testID="btn-to-logout"
          />

          <HoliConfirmation
            label={t('auth.logout.button')}
            title={t('auth.logout.button')}
            description={t('auth.logout.heading')}
            secondaryText={t('auth.logout.confirmation.dismiss')}
            primaryText={t('auth.logout.confirmation.confirm')}
            primaryButtonVariant="danger"
            {...logoutConfirmationProps}
            testID="modal-logout"
          />
        </View>
      </LoginProtection>

      {isLoggingOut && <HoliLoader />}
    </ScrollView>
  )
}

export default withProfiler(SettingsOverview, { name: 'SettingsOverview' })

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    settingsOverview: {
      paddingHorizontal: 24,
    },
    settingsItem: {
      marginVertical: 24,
    },
    separator: {
      width: '100%',
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.background30,
      height: 1,
    },
  })
