import React, { memo, useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, View } from 'react-native'

import DefaultLayout from '@holi/core/DefaultLayout'
import { useScrollYHandler } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

export enum NotificationType {
  POST_REACTION = 'PR',
  POST_COMMENT = 'PC',
  POST_COMMENT_REPLY = 'PCR',
  POST_COMMENT_REACTION = 'PCRA',
  CONNECTION_REQUEST = 'CR',
  CONNECTION_CONFIRMED = 'CC',
  FOLLOW = 'F',
  FOLLOW_REQUEST = 'FR',
  FOLLOW_REQUEST_APPROVED = 'FRA',
  COMMUNITY_INVITE = 'CI',
  POST_USER_MENTION = 'PUM',
  POST_COMMENT_USER_MENTION = 'PCUM',
  COMMUNITY_NEW_POST = 'CNP',
  USER_NEW_POST = 'UNP',
}

interface NotificationBase {
  type: NotificationType
  owner: User
  read: boolean
  created: Date
}

interface NotificationFromUser extends NotificationBase {
  type: NotificationType.CONNECTION_REQUEST | NotificationType.CONNECTION_CONFIRMED
  fromUser: User
}

type Notification = NotificationFromUser // this type will be UNION, so extend it with "NotificationFromUser | AnotherNotification | ..."

const seedNotifications: Notification[] = [{
  type: NotificationType.CONNECTION_REQUEST,
  owner: 
}]

const Notifications: React.VFC = () => {
  const { t } = useTranslation()
  const title = t('notifications.title')
  const mixins = useStyleMixins()
  const { setOptions } = useUnifiedNavigation()
  const onScreenScroll = useScrollYHandler()

  useLayoutEffect(
    () =>
      setOptions({
        title,
        headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon="arrow-down-s" />),
        headerRight: ({ tintColor }) =>
          Platform.OS === 'web' ? <HeaderBackButton icon="close" tintColor={tintColor} /> : undefined,
      }),
    [setOptions, title]
  )

  return (
    <DefaultLayout onScroll={onScreenScroll} scrollEventThrottle={200}>
      <View style={mixins.container}>
        <HoliHeading level="1" size="super">
          {title}
        </HoliHeading>
      </View>
    </DefaultLayout>
  )
}

export default memo(Notifications)
