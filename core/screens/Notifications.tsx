import React, { memo, useLayoutEffect } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Platform, SectionList, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { useScrollYHandler } from '@holi/core/helpers'
import i18n from '@holi/core/i18n'
import { getRelativeDateString } from '@holi/core/i18n/helpers/dateHelper'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { User } from '@holi/core/screens/userprofile/types'
import HoliHeading from '@holi/ui/components/atoms/HoliHeading'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { HoliHorizontalRow } from '@holi/ui/components/molecules/HoliHorizontalRow'
import HoliLink from '@holi/ui/components/molecules/HoliLink'
import HoliUserAvatar from '@holi/ui/components/molecules/HoliUserAvatar'
import { colors, vars } from '@holi/ui/styles/globalVars'
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

const seedNotifications: Notification[] = [
  {
    type: NotificationType.CONNECTION_REQUEST,
    owner: {
      id: '1',
      firstName: 'Max',
      lastName: 'Mustermann',
      fullName: 'Max Mustermann',
      avatar: 'https://www.example.com/avatar.jpg',
      avatarLabel: 'MM',
      avatarDefaultColor: '#FFFFFF',
      interests: [
        { id: 'ANIMAL_WELFARE', title: 'Animal welfare' },
        { id: 'ENVIRONMENTAL_PROTECTION', title: 'Environmental Protection' },
      ],
    },
    read: false,
    created: new Date(),
    fromUser: {
      id: '2',
      firstName: 'Anna',
      lastName: 'Kaufmann',
      fullName: 'Anna Kaufmann',
      avatarLabel: 'AK',
      avatarDefaultColor: '#ff0000',
      interests: [
        { id: 'ANIMAL_WELFARE', title: 'Animal welfare' },
        { id: 'ENVIRONMENTAL_PROTECTION', title: 'Environmental Protection' },
      ],
    },
  },
  {
    type: NotificationType.CONNECTION_REQUEST,
    owner: {
      id: '1',
      firstName: 'Max',
      lastName: 'Mustermann',
      fullName: 'Max Mustermann',
      avatar: 'https://www.example.com/avatar.jpg',
      avatarLabel: 'MM',
      avatarDefaultColor: '#FFFFFF',
      interests: [
        { id: 'ANIMAL_WELFARE', title: 'Animal welfare' },
        { id: 'ENVIRONMENTAL_PROTECTION', title: 'Environmental Protection' },
      ],
    },
    read: false,
    created: new Date(new Date().setDate(new Date().getDate() - 7)),
    fromUser: {
      id: '3',
      firstName: 'Kent',
      lastName: 'Clark',
      fullName: 'Kent Clark',
      avatarLabel: 'KC',
      avatarDefaultColor: '#00ff00',
      interests: [
        { id: 'ANIMAL_WELFARE', title: 'Animal welfare' },
        { id: 'ENVIRONMENTAL_PROTECTION', title: 'Environmental Protection' },
      ],
    },
  },
  {
    type: NotificationType.CONNECTION_REQUEST,
    owner: {
      id: '1',
      firstName: 'Max',
      lastName: 'Mustermann',
      fullName: 'Max Mustermann',
      avatar: 'https://www.example.com/avatar.jpg',
      avatarLabel: 'MM',
      avatarDefaultColor: '#FFFFFF',
      interests: [
        { id: 'ANIMAL_WELFARE', title: 'Animal welfare' },
        { id: 'ENVIRONMENTAL_PROTECTION', title: 'Environmental Protection' },
      ],
    },
    read: false,
    created: new Date(new Date().setDate(1)),
    fromUser: {
      id: '4',
      firstName: 'Bruce',
      lastName: 'Wayne',
      fullName: 'Bruce Wayne',
      avatarLabel: 'BW',
      avatarDefaultColor: '#0008ff',
      interests: [
        { id: 'ANIMAL_WELFARE', title: 'Animal welfare' },
        { id: 'ENVIRONMENTAL_PROTECTION', title: 'Environmental Protection' },
      ],
    },
  },
  {
    type: NotificationType.CONNECTION_REQUEST,
    owner: {
      id: '1',
      firstName: 'Max',
      lastName: 'Mustermann',
      fullName: 'Max Mustermann',
      avatar: 'https://www.example.com/avatar.jpg',
      avatarLabel: 'MM',
      avatarDefaultColor: '#FFFFFF',
      interests: [
        { id: 'ANIMAL_WELFARE', title: 'Animal welfare' },
        { id: 'ENVIRONMENTAL_PROTECTION', title: 'Environmental Protection' },
      ],
    },
    read: false,
    created: new Date(new Date().setMonth(new Date().getMonth() - 2)),
    fromUser: {
      id: '2',
      firstName: 'Barry',
      lastName: 'Allen',
      fullName: 'Barry Allen',
      avatarLabel: 'BA',
      avatarDefaultColor: '#ffe100',
      interests: [
        { id: 'ANIMAL_WELFARE', title: 'Animal welfare' },
        { id: 'ENVIRONMENTAL_PROTECTION', title: 'Environmental Protection' },
      ],
    },
  },
]

const isThisWeek = (date: Date) => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const numDay = now.getDate()

  const start = new Date(now)
  start.setDate(numDay - dayOfWeek)
  start.setHours(0, 0, 0, 0)

  return date >= start && date <= now
}

const isLastWeek = (date: Date) => {
  const lastWeek = new Date(new Date().setDate(new Date().getDate() - 7))
  const dayOfWeek = lastWeek.getDay()
  const numDay = lastWeek.getDate()

  const start = new Date(lastWeek)
  start.setDate(numDay - dayOfWeek)
  start.setHours(0, 0, 0, 0)

  const end = new Date(lastWeek)
  end.setDate(numDay + (7 - dayOfWeek))
  end.setHours(0, 0, 0, 0)

  return date >= start && date <= end
}

interface NotificationGroup {
  title: string
  data: Notification[]
}

const sortNotificationsByDate = (notifications: Notification[]) => {
  return notifications.reduce(
    (acc, notification) => {
      const { created } = notification

      if (isThisWeek(notification.created)) {
        acc[0].data.push(notification)
      } else if (isLastWeek(created)) {
        acc[1].data.push(notification)
      } else {
        acc[2].data.push(notification)
      }

      return acc
    },
    [
      {
        title: i18n.t('notifications.created.thisWeek'),
        data: [],
      },
      {
        title: i18n.t('notifications.created.lastWeek'),
        data: [],
      },
      {
        title: i18n.t('notifications.created.older'),
        data: [],
      },
    ] as [NotificationGroup, NotificationGroup, NotificationGroup]
  )
}

interface NotificationProps<T = Notification> {
  notification: T
  style: StyleProp<ViewStyle>
}

const NotificationConnection: React.VFC<NotificationProps<NotificationFromUser>> = ({ notification, style }) => {
  const { created, read } = notification
  const { id, avatar, avatarDefaultColor, avatarLabel, fullName } = notification.fromUser
  const { t, i18n } = useTranslation()

  return (
    <View style={style}>
      <HoliLink href={`/profile/${id}`} label={fullName}>
        <View style={nStyles.link}>
          <HoliUserAvatar
            imageSrc={avatar}
            label={fullName}
            initials={avatarLabel || ''}
            defaultColor={avatarDefaultColor || ''}
            size="small"
          />

          <View style={nStyles.content}>
            <HoliText size="small" style={nStyles.fontColorGray}>
              <Trans t={t} i18nKey="notifications.connection.message" values={{ name: fullName }}>
                <HoliText size="small" />
              </Trans>
            </HoliText>

            <HoliText size="small" style={[nStyles.fontColorGray, nStyles.createdDate]}>
              {getRelativeDateString(created.toISOString(), i18n.language)}
            </HoliText>
          </View>

          {!read && <View style={nStyles.readStatus} />}
        </View>

        <HoliHorizontalRow gap={8} style={nStyles.buttonContainer}>
          <HoliButton type="secondary" label="" style={nStyles.button}>
            {t('notifications.connection.decline')}
          </HoliButton>

          <HoliButton type="primary" label="" style={nStyles.button}>
            {t('notifications.connection.accept')}
          </HoliButton>
        </HoliHorizontalRow>
      </HoliLink>
    </View>
  )
}

const nStyles = StyleSheet.create({
  link: {
    display: 'flex',
    flexDirection: 'row',
  },
  content: {
    flexGrow: 1,
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
    marginLeft: 12,
  },
  buttonContainer: {
    flexWrap: 'wrap',
    paddingLeft: 48,
  },
  button: {
    marginTop: 12,
  },
})

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
        headerStyle: { backgroundColor: colors.backgroundColorGreyLight },
        headerLeft: () => (Platform.OS === 'web' ? null : <HeaderBackButton icon="arrow-down-s" />),
        headerRight: ({ tintColor }) =>
          Platform.OS === 'web' ? <HeaderBackButton icon="close" tintColor={tintColor} /> : undefined,
        navigationCustomOptions: {
          footerShown: false,
        },
      }),
    [setOptions, title]
  )

  const sortedNotificationsByDate = sortNotificationsByDate(seedNotifications)

  return (
    <View style={styles.mainWrapper}>
      <SectionList
        sections={sortedNotificationsByDate}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <NotificationConnection notification={item} style={styles.notification} />}
        renderSectionHeader={({ section: { title } }) => (
          <HoliHeading size="small" style={styles.groupTitle}>
            {title}
          </HoliHeading>
        )}
        onScroll={onScreenScroll}
        scrollEventThrottle={200}
        style={[mixins.container, styles.sectionList]}
      />
    </View>
  )
}

export default memo(Notifications)

const styles = StyleSheet.create({
  mainWrapper: {
    flex: 1,
    backgroundColor: colors.backgroundColorGreyLight,
    ...Platform.select({
      web: {
        height: '100vh',
      },
    }),
  },
  sectionList: {
    paddingTop: vars.topBarHeight,
  },
  groupTitle: {
    paddingVertical: 12,
  },
  notification: {
    paddingVertical: 12,
  },
})
