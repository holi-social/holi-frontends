import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet, View } from 'react-native'

import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import NotificationsOverview from '@holi/core/screens/notifications/components/NotificationsOverview'
import { colors, vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const Notifications: React.VFC = () => {
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const title = t('notifications.title')
  const { setOptions } = useUnifiedNavigation()

  useLayoutEffect(
    () =>
      setOptions({
        title,
        headerStyle: { backgroundColor: colors.backgroundColorGreyLight },
        headerTransparent: true,
        headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon="arrow-down-s" />),
        headerRight: ({ tintColor }) =>
          Platform.OS === 'web' ? <HeaderBackButton icon="close" tintColor={tintColor} /> : undefined,
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setOptions, title]
  )

  return (
    <SafeAreaView style={styles.contentWrapper}>
      <View style={mixins.container} testID="notifications-overview">
        <NotificationsOverview />
      </View>
    </SafeAreaView>
  )
}

export default memo(Notifications)

const styles = StyleSheet.create({
  contentWrapper: {
    paddingTop: vars.topBarHeight,
    paddingBottom: 0,
    height: '100%',
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
    backgroundColor: colors.backgroundColorGreyLight,
  },
})
