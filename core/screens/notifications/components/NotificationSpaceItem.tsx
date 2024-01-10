import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import HoliIconBadge from '@holi/core/navigation/components/header/HoliIconBadge'
import NotificationContentText from '@holi/core/screens/notifications/components/NotificationContentText'
import { NotificationProps, NotificationSpaceConnection } from '@holi/core/screens/notifications/components/types'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

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
  const { id, title } = notification.options.space
  href = href || `/spaces/${id}`

  const message = notification.options.message ?? notification.options.requestMessage

  return (
    <View style={style} testID={testID}>
      <HoliLink href={href} label={title} mobileNavigateBackFirst>
        <View style={styles.container}>
          <View style={styles.imageContainer}>
            <SpaceAvatar space={notification.options.space} size="small" style={{ borderColor: 'transparent' }} />
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

          <HoliIconBadge showBadge={!read} backgroundColor={colors.background30} style={styles.readStatus} />
        </View>
      </HoliLink>

      {children}
    </View>
  )
}

const styles = StyleSheet.create({
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
    color: colors.foreground20,
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
