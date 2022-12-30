import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import { Notification, NotificationProps } from '@holi/core/screens/notifications/components/types'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliLink from '@holi/ui/components/molecules/HoliLink'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors } from '@holi/ui/styles/globalVars'

interface NotificationWithUserAvatarProps<T = Notification> extends NotificationProps<T> {
  href?: string
  content?: React.ReactNode
  i18nKey?: string
}

const NotificationWithUserAvatar: React.FC<NotificationWithUserAvatarProps> = ({
  notification,
  content,
  children,
  href,
  i18nKey,
  style,
  testID = '',
}) => {
  const { created, read } = notification
  const { id: userId, avatar, avatarDefaultColor, avatarLabel, fullName } = notification.options.user
  const { t, i18n } = useTranslation()
  href = href || `/profile/${userId}`

  return (
    <View style={style} testID={`${testID && testID + '-'}notification-item`}>
      <HoliLink href={href} label={fullName} mobileNavigateBackFirst>
        <View style={styles.link}>
          <HoliUserAvatar
            imageSrc={avatar}
            label={fullName}
            initials={avatarLabel || ''}
            defaultColor={avatarDefaultColor || ''}
            size="small"
          />

          <View style={styles.content}>
            {content || (
              <>
                <HoliText size="small" style={styles.fontColorGray}>
                  <Trans t={t} i18nKey={i18nKey} values={{ name: fullName }}>
                    <HoliText size="small" />
                  </Trans>
                </HoliText>

                <HoliText size="small" style={[styles.fontColorGray, styles.createdDate]}>
                  {getRelativeDateString(created, i18n.language)}
                </HoliText>
              </>
            )}
          </View>

          {!read && <View style={styles.readStatus} />}
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
    color: colors.fontColorGrey,
  },
  createdDate: {
    marginTop: 4,
  },
  readStatus: {
    backgroundColor: colors.secondaryColor,
    height: 8,
    width: 8,
    borderRadius: 4,
    marginTop: 4,
    marginLeft: 12,
  },
})

export default NotificationWithUserAvatar
