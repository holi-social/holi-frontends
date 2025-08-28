import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import NotificationBellBadge from '@holi/core/navigation/components/header/NotificationBellBadge'
import NotificationContentText from '@holi/core/screens/notifications/components/NotificationContentText'
import type { NotificationProps, NotificationSpacePost } from '@holi/core/screens/notifications/components/types'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

const NotificationSpacePostItem = ({ notification, style, testID = '' }: NotificationProps<NotificationSpacePost>) => {
  const { i18n } = useTranslation()
  const { created, read, content } = notification
  const { space } = notification.options
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={style} testID={testID}>
      <HoliLink href={`/spaces/${space.name}?tab=updates`} label={space.title}>
        <View style={styles.link}>
          <SpaceAvatar space={space} size="sm" />

          <View style={styles.content}>
            <NotificationContentText size="small" style={styles.fontColorGray}>
              {content}
            </NotificationContentText>

            <HoliText size="extrasmall" style={[styles.fontColorGray, styles.createdDate]}>
              {getRelativeDateString(created, i18n.language)}
            </HoliText>
          </View>

          <NotificationBellBadge visible={!read} backgroundColor={colors.background30} style={styles.readStatus} />
        </View>
      </HoliLink>
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    link: {
      display: 'flex',
      flexDirection: 'row',
    },
    content: {
      flexGrow: 1,
      flexShrink: 1,
      flexBasis: '100%',
      marginLeft: 12,
    },
    fontColorGray: {
      color: theme.colors.foreground20,
    },
    createdDate: {
      marginTop: 4,
    },
    readStatus: {
      marginLeft: 12,
    },
  })

export default NotificationSpacePostItem
