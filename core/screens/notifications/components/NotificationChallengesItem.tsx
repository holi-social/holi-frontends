import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import NotificationBellBadge from '@holi/core/navigation/components/header/NotificationBellBadge'
import { NotificationChallenges, NotificationProps } from '@holi/core/screens/notifications/components/types'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import challengesColored from '@holi/icons/src/generated/ChallengesColored'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliRichNotificationContent from '@holi/ui/components/molecules/HoliRichNotificationContent/HoliRichNotificationContent'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export const NotificationChallengesItem = ({
  notification,
  testID = '',
}: NotificationProps<NotificationChallenges>) => {
  const { i18n } = useTranslation()
  const { created, read, content, options } = notification

  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  const link = options.link
  const path = link ? '?path=' + encodeURIComponent(link) : ''
  const route = '/apps/challenges' + path

  return (
    <View
      testID={testID}
      style={{
        paddingVertical: 12,
      }}
    >
      <HoliLink href={route} label={'notification'}>
        <View style={styles.link}>
          <HoliIcon icon={challengesColored} size={40} />
          <View style={styles.content}>
            {content && <HoliRichNotificationContent html={content} />}

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

export const getStyles = (theme: HoliTheme) =>
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
