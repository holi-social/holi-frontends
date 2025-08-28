import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import { StyleSheet } from 'react-native-unistyles'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import NotificationBellBadge from '@holi/core/navigation/components/header/NotificationBellBadge'
import NotificationContentText from '@holi/core/screens/notifications/components/NotificationContentText'
import type { NotificationPolls, NotificationProps } from '@holi/core/screens/notifications/components/types'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

const NotificationPollItem = ({ notification }: NotificationProps<NotificationPolls>) => {
  const { i18n } = useTranslation()
  const { created, read, content } = notification
  const { poll } = notification.options
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  const link = poll.insightId ? `/insights/${poll.insightId}` : `/feed-posts/${poll.feedPostId}`

  return (
    <View>
      <HoliLink href={link} label={poll.title}>
        <View style={styles.link}>
          <View style={styles.image}>
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/illustrations/conversation.svg')}
              label="poll-updates-avatar"
              width={26}
              height={26}
              isSvg
              resizeMode="contain"
            />
          </View>
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
    image: {
      backgroundColor: theme.colors.brandA100,
      width: 40,
      height: 40,
      borderRadius: 6,
      alignItems: 'center',
      justifyContent: 'center',
      borderColor: theme.colors.background30,
      borderWidth: 1,
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

export default NotificationPollItem
