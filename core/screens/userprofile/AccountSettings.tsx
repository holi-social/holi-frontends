import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import DefaultScrollHeaderLayout from '@holi/core/components/DefaultScrollHeaderLayout'
import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import { useToastForNotAvailableFeature } from '@holi/core/helpers'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import DeleteAccountButton from '@holi/core/screens/userprofile/components/DeleteAccountButton'
import type { AuthStackScreensList } from '@holi/mobile/navigation/AuthNavigator'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

type ScreenProps = NativeStackScreenProps<AuthStackScreensList>

const AccountSettings: React.VFC<ScreenProps> = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { setOptions } = useUnifiedNavigation()

  useLayoutEffect(() => setOptions({ title: t('profile.settings.account.title') }), [setOptions, t])

  // TODO: remove after implementing the feature
  const showFeatureNotImplementedToast = useToastForNotAvailableFeature()

  return (
    <DefaultScrollHeaderLayout>
      <LoginProtection>
        <View style={[mixins.container, styles.accountSettings]}>
          <MoreOptionItem
            label={t('profile.edit.changePassword')}
            icon="key-2"
            onPress={showFeatureNotImplementedToast}
            style={styles.settingsItem}
          />
        </View>
        <View style={styles.separator} />
        <View style={[mixins.container, styles.accountSettings]}>
          <DeleteAccountButton style={styles.settingsItem} />
        </View>
      </LoginProtection>
    </DefaultScrollHeaderLayout>
  )
}

export default memo(AccountSettings)

const styles = StyleSheet.create({
  accountSettings: {
    paddingHorizontal: 30,
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
