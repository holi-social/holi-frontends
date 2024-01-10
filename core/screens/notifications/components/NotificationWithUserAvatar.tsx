import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import HoliIconBadge from '@holi/core/navigation/components/header/HoliIconBadge'
import NotificationContentText from '@holi/core/screens/notifications/components/NotificationContentText'
import { NotificationProps, NotificationWithUser } from '@holi/core/screens/notifications/components/types'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import { colors } from '@holi/ui/styles/globalVars'

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
  const { id: userId, avatar, avatarBlurhash, avatarDefaultColor, avatarLabel, fullName } = notification.options.user
  href = href || `/profile/${userId}`
  const userFullName = fullName || t('user.profileView.anonymous')

  return (
    <View style={style} testID={testID}>
      <HoliLink href={href} label={userFullName} mobileNavigateBackFirst>
        <View style={styles.link}>
          <HoliAvatar
            imageSrc={avatar}
            imageBlurhash={avatarBlurhash}
            label={userFullName}
            initials={avatarLabel || ''}
            defaultColor={avatarDefaultColor || ''}
            size="small"
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

          <HoliIconBadge visible={!read} backgroundColor={colors.background30} style={styles.readStatus} />
        </View>
      </HoliLink>

      {children}
    </View>
  )
}

const styles = StyleSheet.create({
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
    color: colors.foreground20,
  },
  createdDate: {
    marginTop: 4,
  },
  readStatus: {
    marginLeft: 12,
  },
})

export default NotificationWithUserAvatar
