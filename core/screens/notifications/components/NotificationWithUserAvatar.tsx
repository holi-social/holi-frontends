import type React from 'react'
import { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'
import NotificationBellBadge from '@holi/core/navigation/components/header/NotificationBellBadge'
import NotificationContentText from '@holi/core/screens/notifications/components/NotificationContentText'
import type { NotificationProps, NotificationWithUser } from '@holi/core/screens/notifications/components/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { type HoliTheme, useTheme } from '@holi/ui/styles/theme'
import { Avatar } from 'holi-bricks/components/avatar'

interface NotificationWithUserAvatarProps extends NotificationProps<NotificationWithUser> {
  href?: string
  content?: React.ReactNode
  i18nKey?: string
}

const NotificationWithUserAvatar = ({
  notification,
  content,
  children,
  href,
  i18nKey,
  style,
  testID = '',
}: React.PropsWithChildren<NotificationWithUserAvatarProps>) => {
  const { t, i18n } = useTranslation()
  const { created, read } = notification
  const { id: userId, avatar, avatarLabel, fullName, avatarBlurhash } = notification.options.user
  href = href || `/profile/${userId}`
  const userFullName = fullName || t('user.profileView.anonymous')
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(theme), [theme])

  return (
    <View style={style} testID={testID}>
      <HoliLink href={href} label={userFullName}>
        <View style={styles.link}>
          <Avatar
            imgPlaceholder={avatarBlurhash}
            imgSrc={avatar}
            label={userFullName}
            initials={avatarLabel || ''}
            size="xs"
          />

          <View style={styles.content}>
            {content || (
              <>
                {i18nKey ? (
                  <HoliText size="small" style={styles.fontColorGray}>
                    <Trans t={t} i18nKey={i18nKey} values={{ name: userFullName }}>
                      <HoliText size="small" />
                    </Trans>
                  </HoliText>
                ) : (
                  <NotificationContentText size="small" style={styles.fontColorGray}>
                    {notification.content}
                  </NotificationContentText>
                )}

                <HoliText size="extrasmall" style={[styles.fontColorGray, styles.createdDate]}>
                  {getRelativeDateString(created, i18n.language)}
                </HoliText>
              </>
            )}
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

export default NotificationWithUserAvatar
