import type React from 'react'
import { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import NotificationBellBadge from '@holi/core/navigation/components/header/NotificationBellBadge'
import NotificationContentText from '@holi/core/screens/notifications/components/NotificationContentText'
import type { NotificationProps, NotificationSpaceConnection } from '@holi/core/screens/notifications/components/types'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'

interface NotificationWithSpaceAvatarProps extends NotificationProps<NotificationSpaceConnection> {
  href?: string
  i18nKey?: string
}

const NotificationSpaceItem = ({
  notification,
  children,
  href,
  i18nKey,
  style,
  testID = '',
}: React.PropsWithChildren<NotificationWithSpaceAvatarProps>) => {
  const { t, i18n } = useTranslation()
  const { created, read } = notification
  const fullName = notification.options.user?.fullName || t('user.profileView.anonymous')
  const { title, name } = notification.options.space
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])
  href = href || `/spaces/${name}`

  const message = notification.options.message ?? notification.options.requestMessage

  return (
    <View style={style} testID={testID}>
      <HoliLink href={href} label={title} mobileNavigateBackFirst>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <SpaceAvatar space={notification.options.space} size="sm" />
          </View>
          <View style={styles.content}>
            <>
              {i18nKey ? (
                <HoliText size="small" style={styles.fontColorGray}>
                  <Trans t={t} i18nKey={i18nKey} values={{ user: fullName, space: title }}>
                    <HoliText size="small" />
                  </Trans>
                </HoliText>
              ) : (
                <NotificationContentText size="small" style={[styles.fontColorGray, styles.message]}>
                  {notification.content}
                </NotificationContentText>
              )}

              <HoliText size="extrasmall" style={[styles.fontColorGray, styles.createdDate]}>
                {getRelativeDateString(created, i18n.language)}
              </HoliText>
              {message && !notification.content && (
                <HoliText size="small" style={[styles.fontColorGray, styles.message]}>
                  {message}
                </HoliText>
              )}
            </>
          </View>

          <NotificationBellBadge visible={!read} backgroundColor={colors.background30} style={styles.readStatus} />
        </View>
      </HoliLink>

      {children}
    </View>
  )
}

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    container: {
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
    message: {
      marginTop: 16,
      marginBottom: 4,
    },
    imageContainer: {
      position: 'relative',
      width: 40,
      height: 40,
    },
    image: {
      borderRadius: 8,
      height: '100%',
    },
  })

export default NotificationSpaceItem
