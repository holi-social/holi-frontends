import React, { memo, useLayoutEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import DeleteAccountButton from '@holi/core/screens/userprofile/components/DeleteAccountButton'
import { Key2, Mail } from '@holi/icons/src/generated'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const AccountSettings = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  useLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.account.title') })
  }, [setScreenOptions, t])

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH}>
      <ScrollHeaderLayout.Default>
        <LoginProtection>
          <View style={[mixins.container, styles.accountSettings]}>
            <MoreOptionItem
              label={t('profile.edit.changePassword')}
              icon={Key2}
              onPress={() => navigate('/profile/settings/changePassword')}
              style={styles.settingsItem}
              testID="btn-change-password"
            />
            <MoreOptionItem
              label={t('profile.edit.changeEmail')}
              icon={Mail}
              onPress={() => navigate('/profile/settings/changeEmail')}
              style={styles.settingsItem}
              testID="btn-change-email"
            />
          </View>
          <View style={styles.separator} />
          <View style={[mixins.container, styles.accountSettings]}>
            <DeleteAccountButton style={styles.settingsItem} />
          </View>
        </LoginProtection>
      </ScrollHeaderLayout.Default>
    </PermissionsGuard>
  )
}

export default memo(AccountSettings)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    accountSettings: {
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
