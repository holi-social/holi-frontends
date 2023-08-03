import { withProfiler } from '@sentry/react'
import React, { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import ChatLogin from '@holi/chat/src/client/ChatLogin'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { logError } from '@holi/core/errors/helpers'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import { useLogout } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { IS_CHAT_ENABLED } from '@holi/core/screens/chat/tempConsts'
import { AccountCircle, Help, Lock, Notification2 } from '@holi/icons/src/generated'
import HoliConfirmation, { useConfirmationState } from '@holi/ui/components/molecules/HoliConfirmation'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const chatLoginClient = new ChatLogin()

const SettingsOverview = () => {
  const { t } = useTranslation()
  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const mixins = useStyleMixins()
  const { logout, isLoggingOut } = useLogout()

  const { setShow: setShowLogoutConfirmation, props: logoutConfirmationProps } = useConfirmationState({
    onConfirm: () => {
      if (IS_CHAT_ENABLED) {
        const logoutFromChat = async () => {
          await chatLoginClient.logout()
        }
        logoutFromChat().catch((err) => logError(err))
      }

      logout()
    },
  })

  useLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.overview.title') })
  }, [setScreenOptions, t])

  // TODO: remove after implementing the feature
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()

  return (
    <ScrollHeaderLayout.Default>
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
            label={t('notifications.title')}
            icon={Notification2}
            iconRightStyle="arrow"
            onPress={showFeatureNotImplementedToast}
            tintColor={colors.foreground20}
            style={styles.settingsItem}
          />
          {/* testing mailto links will fail on emulators - see https://github.com/expo/expo/issues/7817 */}
          <MoreOptionItem
            label={t('profile.settings.overview.help')}
            icon={Help}
            iconRightStyle="outlink"
            onPress={() => Linking.openURL(t('global.support.mail.href'))}
            style={styles.settingsItem}
          />
          <MoreOptionItem
            label={t('profile.settings.legalDocuments.title')}
            icon={Lock}
            iconRightStyle="arrow"
            onPress={() => navigate('/profile/settings/legalDocuments')}
            style={styles.settingsItem}
            testID="btn-your-account"
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
    </ScrollHeaderLayout.Default>
  )
}

export default withProfiler(SettingsOverview, { name: 'SettingsOverview' })

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
