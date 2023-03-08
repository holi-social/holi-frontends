import React, { memo, useCallback, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import DefaultLayout from '@holi/core/DefaultLayout'
import LoginProtection from '@holi/core/auth/components/LoginProtection'
import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import { useScrollYHandler } from '@holi/core/helpers'
import useRouting from '@holi/core/navigation/hooks/useRouting'
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
  const onScreenScroll = useScrollYHandler()

  const { navigate } = useRouting()

  useLayoutEffect(() => setOptions({ title: t('profile.settings.account.title') }), [setOptions, t])

  const goTo = useCallback(
    (url: string) => () => {
      navigate(url)
    },
    [navigate]
  )

  return (
    <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200}>
      <LoginProtection>
        <View style={[mixins.container, styles.accountSettings]}>
          <MoreOptionItem
            label={t('profile.edit.changePassword')}
            icon="key-2"
            onPress={goTo('/profile/settings/changePassword')}
            style={styles.settingsItem}
          />
        </View>
        <View style={styles.separator} />
        <View style={[mixins.container, styles.accountSettings]}>
          <DeleteAccountButton style={styles.settingsItem} />
        </View>
      </LoginProtection>
    </DefaultLayout>
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
