import * as Notifications from 'expo-notifications'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleNotificationForRemoteInvitationTriggerMock: Notifications.Notification = {
  request: {
    trigger: {
      remoteMessage: {
        originalPriority: 1,
        sentTime: 1691669916530,
        notification: null,
        data: {
          title: 'holi Chat',
          message: 'You have a new message or invitation.',
          channelId: 'expo_notifications_fallback_notification_channel',
          scopeKey: '@holistic-foundation/projectholi',
          experienceId: '@holistic-foundation/projectholi',
          room_id: '!MjefvsnaJLCiTQHFue:staging.chat.holi.social',
          content: '{"is_direct":true,"displayname":"malte2","membership":"invite"}',
          type: 'm.room.member',
          unread: '1',
          prio: 'high',
          sender: '@malte1:staging.chat.holi.social',
          event_id: '$QTHC68hNtAA0HJwgolBjnzyHmzcmS1u9aE-tukn1SSs',
          membership: 'invite',
          sender_display_name: 'malte1',
        },
        to: null,
        ttl: 2419200,
        collapseKey: null,
        messageType: null,
        priority: 1,
        from: '984061681268',
        messageId: '0:1691669916540901%b0aa3b58f9fd7ecd',
      },
      // @ts-ignore is available on android
      channelId: 'expo_notifications_fallback_notification_channel',
      type: 'push',
    },
    content: {
      title: 'holi Chat',
      badge: null,
      autoDismiss: true,
      // @ts-ignore null can happen if no data is provided
      data: null,
      body: 'You have a new message or invitation.',
      sound: 'default',
      sticky: false,
      subtitle: null,
    },
    identifier: '0:1692011606570797%b0aa3b58f9fd7ecd',
  },
  date: 1692011606554,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleNotificationForRemoteMessageTriggerMock: Notifications.Notification = {
  request: {
    trigger: {
      remoteMessage: {
        originalPriority: 1,
        sentTime: 1692011606554,
        notification: null,
        data: {
          title: 'holi Chat',
          message: 'You have a new message or invitation.',
          channelId: 'expo_notifications_fallback_notification_channel',
          scopeKey: '@holistic-foundation/projectholi',
          experienceId: '@holistic-foundation/projectholi',
          event_id: '$qY7LzQe-ZTIw6lR4ppuyghbABM8FC8LFSaG4BRX0lh0',
          content: '{"body":"hello world!","msgtype":"m.text"}',
          room_id: '!qwGdHhthYWLZHsDwuG:staging.chat.holi.social',
          sender: '@malte1:staging.chat.holi.social',
          type: 'm.room.message',
          sender_display_name: 'malte1',
          prio: 'high',
          unread: '1',
        },
        to: null,
        ttl: 2419200,
        collapseKey: null,
        messageType: null,
        priority: 1,
        from: '984061681268',
        messageId: '0:1692011606570797%b0aa3b58f9fd7ecd',
      },
      // @ts-ignore is available on android
      channelId: 'expo_notifications_fallback_notification_channel',
      type: 'push',
    },
    content: {
      title: 'holi Chat',
      badge: null,
      autoDismiss: true,
      // @ts-ignore null can happen if no data is provided
      data: null,
      body: 'You have a new message or invitation.',
      sound: 'default',
      sticky: false,
      subtitle: null,
    },
    identifier: '0:1692011606570797%b0aa3b58f9fd7ecd',
  },
  date: 1692011606554,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const handleNotificationForLocalTriggerMock: Notifications.Notification = {
  request: {
    // @ts-ignore null can happen if you send it with null
    trigger: null,
    content: {
      title: 'some title',
      badge: null,
      // @ts-ignore available on android
      autoDismiss: true,
      data: { room_id: '!qwGdHhthYWLZHsDwuG:staging.chat.holi.social' },
      body: 'some body',
      sound: 'default',
      sticky: false,
      subtitle: null,
    },
    identifier: 'e3319d84-02a0-4467-8159-07d48c04efc2',
  },
  date: 1692017592571,
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const notificationResponseForRemoteTriggerMock: Notifications.NotificationResponse = {
  notification: {
    request: {
      trigger: {
        remoteMessage: {
          originalPriority: 1,
          sentTime: 1692015244341,
          notification: null,
          data: {
            channelId: 'expo_notifications_fallback_notification_channel',
            message: 'You have a new message or invitation.',
            content: '{"body":"hello world!","msgtype":"m.text"}',
            room_id: '!qwGdHhthYWLZHsDwuG:staging.chat.holi.social',
            sender: '@malte1:staging.chat.holi.social',
            type: 'm.room.message',
            sender_display_name: 'malte1',
            prio: 'high',
            unread: '1',
            experienceId: '@holistic-foundation/projectholi',
            scopeKey: '@holistic-foundation/projectholi',
            event_id: '$iEfUuhURTKVUoZNuUlJeMDpyIK0kSMTmhOSR1kJoGeY',
            title: 'holi Chat',
          },
          to: null,
          ttl: 2419200,
          collapseKey: null,
          messageType: null,
          priority: 1,
          from: '984061681268',
          messageId: '0:1692015244354449%b0aa3b58f9fd7ecd',
        },
        // @ts-ignore is available on android
        channelId: 'expo_notifications_fallback_notification_channel',
        type: 'push',
      },
      content: {
        title: 'holi Chat',
        badge: null,
        autoDismiss: true,
        // @ts-ignore null can happen if no data is provided
        data: null,
        body: 'You have a new message or invitation.',
        sound: 'default',
        sticky: false,
        subtitle: null,
      },
      identifier: '0:1692015244354449%b0aa3b58f9fd7ecd',
    },
    date: 1692015244341,
  },
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const notificationResponseForLocalTriggerMock: Notifications.NotificationResponse = {
  notification: {
    request: {
      // @ts-ignore null can happen if you send it with null
      trigger: null,
      content: {
        title: 'some title',
        badge: null,
        // @ts-ignore available on android
        autoDismiss: true,
        data: { room_id: '!qwGdHhthYWLZHsDwuG:staging.chat.holi.social' },
        body: 'some body',
        sound: 'default',
        sticky: false,
        subtitle: null,
      },
      identifier: 'e3319d84-02a0-4467-8159-07d48c04efc2',
    },
    date: 1692017592571,
  },
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
}
