import { withProfiler } from '@sentry/react'
import React, { memo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, SafeAreaView, StyleSheet } from 'react-native'

import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import NotificationsOverview from '@holi/core/screens/notifications/components/NotificationsOverview'
import { ArrowDownS, Close } from '@holi/icons/src/generated'
import { colors } from '@holi/ui/styles/globalVars'

const Notifications = () => {
  const { t } = useTranslation()
  const title = t('notifications.title')
  const setScreenOptions = useSetScreenOptions()

  useIsomorphicLayoutEffect(
    () =>
      setScreenOptions({
        title,
        headerStyle: { backgroundColor: colors.background30 },
        headerTransparent: true,
        headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon={ArrowDownS} />),
        headerRight: ({ tintColor }) =>
          Platform.OS === 'web' ? <HeaderBackButton icon={Close} tintColor={tintColor} /> : undefined,
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setScreenOptions, title]
  )

  return (
    <SafeAreaView style={styles.contentWrapper} testID="notifications-overview">
      <NotificationsOverview />
    </SafeAreaView>
  )
}

export default withProfiler(memo(Notifications), { name: 'Notifications' })

const styles = StyleSheet.create({
  contentWrapper: {
    height: '100%',
    ...Platform.select({
      web: {
        minHeight: '100vh',
      },
    }),
    backgroundColor: colors.background30,
  },
})
