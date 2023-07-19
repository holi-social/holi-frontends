import React from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import NotificationBadge from '@holi/core/navigation/components/NotificationBadge'
import { NotificationProps, NotificationSpacePost } from '@holi/core/screens/notifications/components/types'
import SpaceAvatar from '@holi/core/screens/spaces/components/SpaceAvatar'
import HoliLink from '@holi/ui/components/atoms/HoliLink'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliAvatar from '@holi/ui/components/molecules/HoliAvatar'
import { colors } from '@holi/ui/styles/globalVars'

const NotificationSpacePostItem = ({ notification, style, testID = '' }: NotificationProps<NotificationSpacePost>) => {
  const { t, i18n } = useTranslation()
  const { created, read } = notification
  const { space, teaser, post } = notification.options

  const { avatar, avatarBlurhash, avatarDefaultColor, avatarLabel, fullName } = notification.options.post.creator ?? {}
  const userFullName = fullName || t('user.profileView.anonymous')

  const getI18Key = () => {
    if (post.isPublic) return 'notifications.space.post.public.created.message'

    return 'notifications.space.post.private.created.message'
  }

  return (
    <View style={style} testID={testID}>
      <HoliLink href={`/posts/${post?.id}`} label={post?.title} mobileNavigateBackFirst>
        <View style={styles.link}>
          {post.isPublic ? (
            <SpaceAvatar space={notification.options.space} size="small" style={{ borderColor: 'transparent' }} />
          ) : (
            <HoliAvatar
              imageSrc={avatar}
              imageBlurhash={avatarBlurhash}
              label={userFullName}
              initials={avatarLabel || ''}
              defaultColor={avatarDefaultColor || ''}
              size="small"
            />
          )}

          <View style={styles.content}>
            <HoliText size="small" style={styles.fontColorGray}>
              <Trans t={t} i18nKey={getI18Key()} values={{ user: userFullName, space: space?.title, post: teaser }}>
                <HoliText size="small" />
              </Trans>
            </HoliText>

            <HoliText size="extrasmall" style={[styles.fontColorGray, styles.createdDate]}>
              {getRelativeDateString(created, i18n.language)}
            </HoliText>
          </View>

          <NotificationBadge visible={!read} backgroundColor={colors.background30} style={styles.readStatus} />
        </View>
      </HoliLink>
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

export default NotificationSpacePostItem
