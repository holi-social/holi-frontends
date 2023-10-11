import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, StyleSheet, View } from 'react-native'

import LoginProtection from '@holi/core/auth/components/LoginProtection'
import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import PermissionsGuard, { PermissionsType } from '@holi/core/components/PermissionsGuard'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Mail, Questionnaire } from '@holi/icons/src/generated'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const HelpSettings = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()

  const setScreenOptions = useSetScreenOptions()

  useLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.account.title') })
  }, [setScreenOptions, t])

  return (
    <PermissionsGuard permissionType={PermissionsType.AUTH}>
      <ScrollHeaderLayout.Default>
        <LoginProtection>
          <View style={[mixins.container, styles.HelpSettings]}>
            <MoreOptionItem
              label={t('profile.settings.help.faq')}
              icon={Questionnaire}
              iconRightStyle="outlink"
              onPress={() => Linking.openURL(t('global.support.faq.href'))}
              style={styles.settingsItem}
            />
            {/* testing mailto links will fail on emulators - see https://github.com/expo/expo/issues/7817 */}
            <MoreOptionItem
              label={t('profile.settings.help.support')}
              icon={Mail}
              iconRightStyle="outlink"
              onPress={() => Linking.openURL(t('global.support.mail.href'))}
              style={styles.settingsItem}
            />
          </View>
        </LoginProtection>
      </ScrollHeaderLayout.Default>
    </PermissionsGuard>
  )
}

export default memo(HelpSettings)

const styles = StyleSheet.create({
  HelpSettings: {
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
