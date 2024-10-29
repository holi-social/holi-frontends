import { withProfiler } from '@sentry/react'
import React, { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { DimensionValue, Platform, StyleSheet, View } from 'react-native'

import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useSetScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import NotificationsOverview from '@holi/core/screens/notifications/components/NotificationsOverview'
import { ArrowDownS, Close } from '@holi/icons/src/generated'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

const Notifications = () => {
  const { t } = useTranslation()
  const title = t('notifications.title')
  const setScreenOptions = useSetScreenOptions()
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  useIsomorphicLayoutEffect(
    () =>
      setScreenOptions({
        title,
        headerStyle: { backgroundColor: colors.background30 },
        headerTransparent: false,
        headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon={ArrowDownS} />),
        headerRight: ({ tintColor }) =>
          Platform.OS === 'web' ? <HeaderBackButton icon={Close} tintColor={tintColor} /> : undefined,
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setScreenOptions, title, colors.background30]
  )

  return (
    <View style={styles.contentWrapper} testID="notifications-overview">
      <NotificationsOverview />
    </View>
  )
}

export default withProfiler(memo(Notifications), { name: 'Notifications' })

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    contentWrapper: {
      height: '100%',
      ...Platform.select({
        web: {
          minHeight: '100vh' as DimensionValue,
        },
      }),
      backgroundColor: theme.colors.background30,
    },
  })
