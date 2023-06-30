import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import DeleteAccountButton from '@holi/core/screens/userprofile/components/DeleteAccountButton'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const AccountSettings = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const { navigate } = useRouting()
  const setScreenOptions = useSetScreenOptions()

  useLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.account.title') })
  }, [setScreenOptions, t])

  return (
    <ScrollHeaderLayout.Default>
      <LoginProtection>
        <View style={[mixins.container, styles.accountSettings]}>
          <MoreOptionItem
            label={t('profile.edit.changePassword')}
            icon="key-2"
            onPress={() => navigate('/profile/settings/changePassword')}
            style={styles.settingsItem}
            testID="btn-change-password"
          />
        </View>
        <View style={styles.separator} />
        <View style={[mixins.container, styles.accountSettings]}>
          <DeleteAccountButton style={styles.settingsItem} />
        </View>
      </LoginProtection>
    </ScrollHeaderLayout.Default>
  )
}

export default memo(AccountSettings)

const styles = StyleSheet.create({
  accountSettings: {
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
