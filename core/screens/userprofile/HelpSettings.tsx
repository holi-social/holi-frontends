import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Linking, ScrollView, View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import MoreOptionItem from '@holi/core/components/MoreOptionItem'
import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { Mail, Questionnaire } from '@holi/icons/src/generated'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const HelpSettings = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const setScreenOptions = useSetScreenOptions()

  useIsomorphicLayoutEffect(() => {
    setScreenOptions({ title: t('profile.settings.help.title') })
  }, [setScreenOptions, t])

  return (
    <ScrollView>
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
    </ScrollView>
  )
}

export default memo(HelpSettings)

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    HelpSettings: {
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
