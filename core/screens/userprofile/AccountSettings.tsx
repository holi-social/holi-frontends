import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ScrollView, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import DeleteAccountButton from '@holi/core/screens/userprofile/components/DeleteAccountButton'
import { Key2, Mail } from '@holi/icons/src/generated'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'

const AccountSettings = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const { user } = useLoggedInUser()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.account.title') })
  }, [setScreenOptions, t])

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH}>
      <ScrollView>
        <LoginProtection>
          <View style={[mixins.container, styles.accountSettings]}>
            {!user?.isOidc && (
              <MoreOptionItem
                label={t('profile.edit.changePassword')}
                icon={Key2}
                onPress={() => navigate('/profile/settings/changePassword')}
                style={styles.settingsItem}
                testID="btn-change-password"
              />
            )}
            {!user?.isOidc && (
              <MoreOptionItem
                label={t('profile.edit.changeEmail')}
                icon={Mail}
                onPress={() => navigate('/profile/settings/changeEmail')}
                style={styles.settingsItem}
                testID="btn-change-email"
              />
            )}
          </View>
          <View style={styles.separator} />
          <View style={[mixins.container, styles.accountSettings]}>
            <DeleteAccountButton style={styles.settingsItem} />
          </View>
        </LoginProtection>
      </ScrollView>
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
