it('do nothing', () => {
  expect(true).toBe(true)
})

/*
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
const androidPushMessageWhenAppKilled2 = {
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
  notification: {
    date: 1729597659632,
    request: {
      identifier: '0:1729597659642943%90033c7ff9fd7ecd',
      content: {
        subtitle: null,
        priority: 'high',
        data: {
          title: 'holi Chat',
          unread: '1',
          experienceId: '@holistic-foundation/projectholi',
          content_msgtype: 'm.text',
          missed_calls: 'None',
          scopeKey: '@holistic-foundation/projectholi',
          prio: 'high',
          sender_display_name: 'q3 LastName',
          type: 'm.room.message',
          sender: '@q3.lastname:local.chat.holi.social',
          room_id: '!AHWpYCuIKpCWPLcKqP:local.chat.holi.social',
          content_body: 'Killed',
          event_id: '$ZT9UDV9jH6Kxb-H2rivrZwRfZVJVLnTbIFcqAtJOa9A',
          message: 'Du hast eine neue Nachricht oder Einladung.',
          channelId: 'expo_notifications_fallback_notification_channel',
        },
        autoDismiss: true,
        sticky: false,
        sound: 'default',
        body: 'Du hast eine neue Nachricht oder Einladung.',
        badge: null,
        title: 'holi Chat',
      },
      trigger: {
        type: 'push',
        channelId: 'expo_notifications_fallback_notification_channel',
        remoteMessage: {
          messageId: '0:1729597659642943%90033c7ff9fd7ecd',
          from: '984061681268',
          priority: 1,
          messageType: null,
          collapseKey: null,
          ttl: 2419200,
          to: null,
          data: {
            title: 'holi Chat',
            unread: '1',
            experienceId: '@holistic-foundation/projectholi',
            content_msgtype: 'm.text',
            missed_calls: 'None',
            scopeKey: '@holistic-foundation/projectholi',
            prio: 'high',
            sender_display_name: 'q3 LastName',
            type: 'm.room.message',
            sender: '@q3.lastname:local.chat.holi.social',
            room_id: '!AHWpYCuIKpCWPLcKqP:local.chat.holi.social',
            content_body: 'Killed',
            event_id: '$ZT9UDV9jH6Kxb-H2rivrZwRfZVJVLnTbIFcqAtJOa9A',
            message: 'Du hast eine neue Nachricht oder Einladung.',
            channelId: 'expo_notifications_fallback_notification_channel',
          },
          notification: null,
          sentTime: 1729597659632,
          originalPriority: 1,
        },
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
const androidPushMessageWhenAppInBackground2 = {
  notification: {
    request: {
      trigger: {
        remoteMessage: {
          originalPriority: 1,
          sentTime: 1729595376930,
          notification: null,
          data: {
            channelId: 'expo_notifications_fallback_notification_channel',
            message: 'Du hast eine neue Nachricht oder Einladung.',
            event_id: '$bt2oCa00xn1i62aGxypfuqlwvgbp3CmTt3aiQJp9H6Q',
            content_body: 'Backgound',
            room_id: '!AHWpYCuIKpCWPLcKqP:local.chat.holi.social',
            sender: '@q3.lastname:local.chat.holi.social',
            type: 'm.room.message',
            sender_display_name: 'q3 LastName',
            prio: 'high',
            scopeKey: '@holistic-foundation/projectholi',
            missed_calls: 'None',
            content_msgtype: 'm.text',
            experienceId: '@holistic-foundation/projectholi',
            unread: '1',
            title: 'holi Chat',
          },
          to: null,
          ttl: 2419200,
          collapseKey: null,
          messageType: null,
          priority: 1,
          from: '984061681268',
          messageId: '0:1729595376941329%90033c7ff9fd7ecd',
        },
        channelId: 'expo_notifications_fallback_notification_channel',
        type: 'push',
      },
      content: {
        title: 'holi Chat',
        badge: null,
        body: 'Du hast eine neue Nachricht oder Einladung.',
        sound: 'default',
        sticky: false,
        autoDismiss: true,
        data: {
          channelId: 'expo_notifications_fallback_notification_channel',
          message: 'Du hast eine neue Nachricht oder Einladung.',
          event_id: '$bt2oCa00xn1i62aGxypfuqlwvgbp3CmTt3aiQJp9H6Q',
          content_body: 'Backgound',
          room_id: '!AHWpYCuIKpCWPLcKqP:local.chat.holi.social',
          sender: '@q3.lastname:local.chat.holi.social',
          type: 'm.room.message',
          sender_display_name: 'q3 LastName',
          prio: 'high',
          scopeKey: '@holistic-foundation/projectholi',
          missed_calls: 'None',
          content_msgtype: 'm.text',
          experienceId: '@holistic-foundation/projectholi',
          unread: '1',
          title: 'holi Chat',
        },
        priority: 'high',
        subtitle: null,
      },
      identifier: '0:1729595376941329%90033c7ff9fd7ecd',
    },
    date: 1729595376930,
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

const androidNovuNotificationResponseWhenAppInBackgroundOrKilled = {
  notification: {
    request: {
      trigger: {
        remoteMessage: {
          originalPriority: 2,
          sentTime: 1729674707370,
          notification: null,
          data: {
            notificationType: 'SPACE_MEMBERSHIP_REQUEST',
            message: 'q3 LastName wants to join Space 4\n',
            title: 'Request for Space 4 on holi',
            data: '{"requestMessage":"","user":{"id":"34274674-088f-4dad-9d93-18aae88615be","fullName":"q3 LastName","avatar":"","avatarBlurhash":"","avatarDefaultColor":"#F8F860","avatarLabel":"QL"},"space":{"id":"2eb51ccf-e811-4686-a62e-c1d03ea93a74","name":"space-4","title":"Space 4","avatar":"","avatarBlurhash":"","avatarDefaultColor":"#F8F860"},"requestDatetime":"2024-10-23T11:11:46.175665","collaboratorsLink":"https://staging.dev.holi.social/spaces/space-4/collaborators/manage?tab=pending&userId=34274674-088f-4dad-9d93-18aae88615be"}',
            notificationVersion: '1.0.0',
            body: 'q3 LastName wants to join Space 4\n',
          },
          to: null,
          ttl: 2419200,
          collapseKey: null,
          messageType: null,
          priority: 2,
          from: '984061681268',
          messageId: '0:1729674707379356%90033c7ff9fd7ecd',
        },
        channelId: null,
        type: 'push',
      },
      content: {
        title: 'Request for Space 4 on holi',
        badge: null,
        body: 'q3 LastName wants to join Space 4\n',
        sound: 'default',
        sticky: false,
        autoDismiss: true,
        data: {
          notificationType: 'SPACE_MEMBERSHIP_REQUEST',
          message: 'q3 LastName wants to join Space 4\n',
          title: 'Request for Space 4 on holi',
          data: '{"requestMessage":"","user":{"id":"34274674-088f-4dad-9d93-18aae88615be","fullName":"q3 LastName","avatar":"","avatarBlurhash":"","avatarDefaultColor":"#F8F860","avatarLabel":"QL"},"space":{"id":"2eb51ccf-e811-4686-a62e-c1d03ea93a74","name":"space-4","title":"Space 4","avatar":"","avatarBlurhash":"","avatarDefaultColor":"#F8F860"},"requestDatetime":"2024-10-23T11:11:46.175665","collaboratorsLink":"https://staging.dev.holi.social/spaces/space-4/collaborators/manage?tab=pending&userId=34274674-088f-4dad-9d93-18aae88615be"}',
          notificationVersion: '1.0.0',
          body: 'q3 LastName wants to join Space 4\n',
        },
        priority: 'default',
        subtitle: null,
      },
      identifier: '0:1729674707379356%90033c7ff9fd7ecd',
    },
    date: 1729674707370,
  },
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
}

const androidNovuDataNotificationResponseWhenAppInBackgroundOrKilled = {
  notification: {
    request: {
      trigger: { channelId: null, type: 'push' },
      content: {
        title: null,
        data: {
          notificationVersion: '1.0.0',
          notificationType: 'SPACE_MEMBERSHIP_REQUEST',
          'gcm.n.analytics_data': { 'google.c.a.e': '1', from: '984061681268' },
          'google.message_id': '0:1729609089644071%90033c7f90033c7f',
          'google.product_id': 111881503,
          collapse_key: 'social.holi.app.dev',
          'google.delivered_priority': 'normal',
          'google.original_priority': 'normal',
          data: '{"user": {"id": "34274674-088f-4dad-9d93-18aae88615be", "fullName": "q3 LastName", "avatar": "", "avatarBlurhash": "", "avatarDefaultColor": "#F8F860", "avatarLabel": "QL"}, "space": {"id": "2eb51ccf-e811-4686-a62e-c1d03ea93a74", "name": "space-4", "title": "Space 4", "avatar": "", "avatarBlurhash": "", "avatarDefaultColor": "#F8F860"}, "requestMessage": "Background", "requestDatetime": "2024-10-22T16:58:08.454841", "collaboratorsLink": "https://staging.dev.holi.social/spaces/space-4/collaborators/manage?tab=pending&userId=34274674-088f-4dad-9d93-18aae88615be"}',
          'google.sent_time': 1729609089634,
          from: '984061681268',
          'google.ttl': 2419200,
        },
      },
      identifier: '0:1729609089644071%90033c7f90033c7f',
    },
    date: 1729609089634,
  },
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
}

// TODO ios and actual tests
const iOSScheduledNotificationWhenAppInForeground = {
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
  notification: {
    date: 1729595171.641351,
    request: {
      content: {
        summaryArgumentCount: 0,
        targetContentIdentifier: null,
        threadIdentifier: '',
        interruptionLevel: 'active',
        attachments: [],
        categoryIdentifier: '',
        summaryArgument: '',
        data: {
          room_id: '!AHWpYCuIKpCWPLcKqP:local.chat.holi.social',
        },
        title: 'New message',
        subtitle: null,
        badge: null,
        launchImageName: '',
        sound: null,
        body: 'Foreground Home',
      },
      identifier: 'd5771f8a-c7c0-443a-a7b7-0c299363c17c',
      trigger: { type: 'unknown' },
    },
  },
}

const iOSChatNotificationResponseWhenAppInBackgroundOrKilled = {
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
  notification: {
    date: 1729595377.3655143,
    request: {
      content: {
        summaryArgumentCount: 0,
        targetContentIdentifier: null,
        threadIdentifier: '',
        interruptionLevel: 'active',
        attachments: [],
        categoryIdentifier: '',
        summaryArgument: null,
        data: null,
        title: 'holi Chat',
        subtitle: null,
        badge: 1,
        launchImageName: '',
        sound: null,
        body: 'You have a new message or invitation.',
      },
      identifier: '706A209A-CFFD-4680-8D5C-320D57DDEFAF',
      trigger: {
        payload: {
          event_id: '$bt2oCa00xn1i62aGxypfuqlwvgbp3CmTt3aiQJp9H6Q',
          room_id: '!AHWpYCuIKpCWPLcKqP:local.chat.holi.social',
          experienceId: '@holistic-foundation/projectholi',
          scopeKey: '@holistic-foundation/projectholi',
          aps: {
            badge: 1,
            alert: {
              body: 'You have a new message or invitation.',
              title: 'holi Chat',
              'loc-key': 'MSG_FROM_USER_WITH_CONTENT',
              'loc-args': ['q3 LastName', 'Backgound or Killed'],
            },
          },
        },
        type: 'push',
        class: 'UNPushNotificationTrigger',
      },
    },
  },
}

const iOSNovuNotificationResponseWhenAppInBackgroundOrKilled = {
  actionIdentifier: 'expo.modules.notifications.actions.DEFAULT',
  notification: {
    date: 1729601205.480622,
    request: {
      content: {
        summaryArgumentCount: 0,
        targetContentIdentifier: null,
        threadIdentifier: '',
        interruptionLevel: 'active',
        attachments: [],
        categoryIdentifier: '',
        summaryArgument: null,
        data: null,
        title: 'Request for Space 4 on holi',
        subtitle: null,
        badge: null,
        launchImageName: '',
        sound: null,
        body: 'q3 LastName wants to join Space 4\nBackground',
      },
      identifier: '2C279CF4-51CD-4E9E-BDD9-9133FFAF3B37',
      trigger: {
        payload: {
          data: {
            requestMessage: 'Background',
            collaboratorsLink:
              'https://staging.dev.holi.social/spaces/space-4/collaborators/manage?tab=pending&userId=34274674-088f-4dad-9d93-18aae88615be',
            space: {
              id: '2eb51ccf-e811-4686-a62e-c1d03ea93a74',
              title: 'Space 4',
              avatarDefaultColor: '#F8F860',
              avatar: '',
              name: 'space-4',
              avatarBlurhash: '',
            },
            user: {
              avatarLabel: 'QL',
              id: '34274674-088f-4dad-9d93-18aae88615be',
              avatarDefaultColor: '#F8F860',
              avatar: '',
              avatarBlurhash: '',
              fullName: 'q3 LastName',
            },
            requestDatetime: '2024-10-22T14:46:43.899859',
          },
          notificationType: 'SPACE_MEMBERSHIP_REQUEST',
          aps: {
            alert: { title: 'Request for Space 4 on holi', body: 'q3 LastName wants to join Space 4\nBackground' },
          },
          notificationVersion: '1.0.0',
        },
        type: 'push',
        class: 'UNPushNotificationTrigger',
      },
    },
  },
}
*/
