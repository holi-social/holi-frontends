// AppNavigator received from push notification interaction (app killed)
const androidPushMessageWhenAppKilled = {
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
  notification: {
    date: 1729585840956,
    request: {
      identifier: '0:1729585840965969%90033c7f90033c7f',
      content: {
        data: {
          'google.ttl': 2419200,
          title: 'holi Chat',
          'google.original_priority': 'high',
          'google.delivered_priority': 'high',
          sender_display_name: 'Daniel +Holi',
          sender: '@daniel1:development-chat.holi.social',
          'google.sent_time': 1729585840956,
          type: 'm.room.message',
          room_id: '!pRnMWDWdcaxrspNjuJ:development-chat.holi.social',
          prio: 'high',
          experienceId: '@holistic-foundation/projectholi',
          unread: '1',
          content_msgtype: 'm.text',
          scopeKey: '@holistic-foundation/projectholi',
          missed_calls: 'None',
          'google.product_id': 111881503,
          from: '984061681268',
          channelId: 'expo_notifications_fallback_notification_channel',
          event_id: '$gdI-QbiUq214fe7bg0d37oM3izqmfTIpqNQslgE7hoA',
          content_body: '10:30',
          'google.message_id': '0:1729585840965969%90033c7f90033c7f',
          message: 'Du hast eine neue Nachricht oder Einladung.',
          'gcm.n.analytics_data': {
            from: '984061681268',
            'google.c.a.e': '1',
          },
          collapse_key: 'social.holi.app.dev',
        },
        title: 'holi Chat',
      },
      trigger: {
        type: 'push',
        channelId: 'expo_notifications_fallback_notification_channel',
      },
    },
  },
}

// AppNavigator received from push (app in background)
const androidPushMessageWhenAppInBackground = {
  notification: {
    request: {
      trigger: {
        channelId: 'expo_notifications_fallback_notification_channel',
        type: 'push',
      },
      content: {
        title: 'holi Chat',
        data: {
          collapse_key: 'social.holi.app.dev',
          'gcm.n.analytics_data': {
            'google.c.a.e': '1',
            from: '984061681268',
          },
          message: 'Du hast eine neue Nachricht oder Einladung.',
          'google.message_id': '0:1729586254010021%90033c7f90033c7f',
          content_body: '10:37',
          event_id: '$fO5RXFO774iahlOi4CAr1TtqLO5mJcF-y85g9MkPilM',
          channelId: 'expo_notifications_fallback_notification_channel',
          from: '984061681268',
          'google.product_id': 111881503,
          missed_calls: 'None',
          scopeKey: '@holistic-foundation/projectholi',
          content_msgtype: 'm.text',
          unread: '1',
          experienceId: '@holistic-foundation/projectholi',
          prio: 'high',
          room_id: '!pRnMWDWdcaxrspNjuJ:development-chat.holi.social',
          type: 'm.room.message',
          'google.sent_time': 1729586254000,
          sender: '@daniel1:development-chat.holi.social',
          sender_display_name: 'Daniel +Holi',
          'google.delivered_priority': 'high',
          'google.original_priority': 'high',
          title: 'holi Chat',
          'google.ttl': 2419200,
        },
      },
      identifier: '0:1729586254010021%90033c7f90033c7f',
    },
    date: 1729586254000,
  },
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
}

// AppNavigator received from scheduled chat notification (app in foreground)
const androidScheduledNotificationWhenAppInForeground = {
  notification: {
    request: {
      trigger: null,
      content: {
        autoDismiss: true,
        title: 'New message',
        badge: null,
        sticky: false,
        sound: 'default',
        body: '10:34',
        subtitle: null,
        data: {
          room_id: '!pRnMWDWdcaxrspNjuJ:development-chat.holi.social',
        },
      },
      identifier: 'bec8fac6-cd86-4826-a167-e1a6b7c96012',
    },
    date: 1729586063472,
  },
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
}

// TODO ios and actual tests
