import * as Device from 'expo-device'
import { PermissionStatus } from 'expo-modules-core'
import * as Notifications from 'expo-notifications'
import { NotificationContentInput } from 'expo-notifications'
import * as TaskManager from 'expo-task-manager'
import { Platform } from 'react-native'

import { logDebug } from '@holi/core/helpers/logging'

const defaultChannelId = 'holiDefault'

// TODO deregister notifications, see https://docs.expo.dev/versions/latest/sdk/notifications/#usage
// TODO set configurable properties (e.g. notification icon, color and sound), see https://docs.expo.dev/versions/latest/sdk/notifications/#configurable-properties
// TODO setup background events for iOS, see https://docs.expo.dev/versions/latest/sdk/notifications/#configurable-properties
export const initNotifications = async () => {
  if (!Device.isDevice) {
    return Promise.resolve()
  } else {
    logDebug('initNotifications', 'initializing notifications')

    // TODO is correct, but using it's id causes an error "Failed to schedule notification"
    if (Platform.OS === 'android') {
      // only needed for doing things other than the default
      await Notifications.setNotificationChannelAsync(defaultChannelId, {
        name: 'Default',
        // corresponds to https://developer.android.com/develop/ui/views/notifications#importance
        // MAX allow us not only to play sounds, but also to pop on screen (default is no sound, no pop on screen)
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      })
    }

    return Notifications.getPermissionsAsync()
      .then((response) => {
        if (response.status === PermissionStatus.UNDETERMINED) {
          return Notifications.requestPermissionsAsync()
        } else {
          return response
        }
      })
      .then((response) => {
        // TODO ensure that also provisional and ephemeral is covered by this GRANTED interpretation, see https://docs.expo.dev/versions/latest/sdk/notifications/#interpret-the-ios-permissions-response
        if (response.status === PermissionStatus.GRANTED) {
          logDebug('initNotifications', 'notification permissions granted, setting up notificationHandler')
          registerHandleNotificationsWhenAppIsInForeground()
          registerHandleNotificationsWhenAppIsInBackground()
        }
      })
  }
}

// TODO write unit test with this as real mock data
// {
//   request: {
//     trigger: {
//       remoteMessage: {
//         originalPriority: 1,
//         sentTime: 1691669916530,
//         notification: null,
//         data: {
//           room_id: '!MjefvsnaJLCiTQHFue:staging.chat.holi.social',
//           content: '{"is_direct":true,"displayname":"malte2","membership":"invite"}',
//           type: 'm.room.member',
//           unread: '1',
//           prio: 'high',
//           sender: '@malte1:staging.chat.holi.social',
//           event_id: '$QTHC68hNtAA0HJwgolBjnzyHmzcmS1u9aE-tukn1SSs',
//           membership: 'invite',
//           sender_display_name: 'malte1',
//         },
//         to: null,
//         ttl: 2419200,
//         collapseKey: null,
//         messageType: null,
//         priority: 1,
//         from: '984061681268',
//         messageId: '0:1691669916540901%b0aa3b58f9fd7ecd',
//       },
//       channelId: null,
//       type: 'push',
//     },
//     content: {
//       title: null,
//       badge: null,
//       autoDismiss: true,
//       data: null,
//       body: null,
//       sound: 'default',
//       sticky: false,
//       subtitle: null,
//     },
//     identifier: '0:1691669916540901%b0aa3b58f9fd7ecd',
//   },
//   date: 1691669916530,
// }

// TODO write unit test with this as real mock data
// {
//   request: {
//     trigger: {
//       remoteMessage: {
//         originalPriority: 1,
//         sentTime: 1691672207949,
//         notification: null,
//         data: {
//           room_id: '!qwGdHhthYWLZHsDwuG:staging.chat.holi.social',
//           unread: '3',
//           content: '{"body":"hello","msgtype":"m.text"}',
//           type: 'm.room.message',
//           prio: 'high',
//           sender: '@malte1:staging.chat.holi.social',
//           event_id: '$ZWZ90Fddmi5R0z8eYnSfzJFlKnbMK3BefeReULkuDCc',
//           sender_display_name: 'malte1',
//         },
//         to: null,
//         ttl: 2419200,
//         collapseKey: null,
//         messageType: null,
//         priority: 1,
//         from: '984061681268',
//         messageId: '0:1691672207967939%b0aa3b58f9fd7ecd',
//       },
//       channelId: null,
//       type: 'push',
//     },
//     content: {
//       title: null,
//       badge: null,
//       autoDismiss: true,
//       data: null,
//       body: null,
//       sound: 'default',
//       sticky: false,
//       subtitle: null,
//     },
//     identifier: '0:1691672207967939%b0aa3b58f9fd7ecd',
//   },
//   date: 1691672207949,
// }

interface UnknownSygnalMessageContent {
  msgtype: unknown
  body: unknown
}

interface UnimplementedSygnalMessageContent extends UnknownSygnalMessageContent {
  msgtype: undefined // anything, just using undefined to have no overlap with real values/
  body: string | undefined
}

interface SygnalMessageContentText extends UnknownSygnalMessageContent {
  msgtype: 'm.text'
  body: string // e.g. "example text"
}

type SygnalMessageContent = SygnalMessageContentText | UnimplementedSygnalMessageContent

interface SygnalMemberChangeContent {
  is_direct: boolean
  displayname: string
  membership: 'invite' | string
}

interface UnknownSygnalEvent {
  event_id: string // e.g. "$RZc5AqDDH1Nx3Ru5OeWCennKG5wJcdMQfPOHrv8_1VA"
  type: unknown
  content: unknown
}

interface AnonymizedSygnalEvent extends UnknownSygnalEvent {
  // type etc. not available if 'event_id_only' is configured in pusher
  type: undefined
  content: undefined
  sender: undefined
  sender_display_name: undefined
}

interface SygnalRoomEvent extends UnknownSygnalEvent {
  prio: string // e.g. "high"
  unread: string // e.g. "1"
  room_id: string // e.g. "!yYrrLMRIfsHiunBbat:staging.chat.holi.social"
  sender: string // e.g. "@malte1:staging.chat.holi.social"
  sender_display_name: string // e.g. "malte1"
}

interface SygnalRoomMemberChange extends SygnalRoomEvent {
  type: 'm.room.member'
  content: SygnalMemberChangeContent
  membership: 'invite' | string
}

interface SygnalRoomMessage extends SygnalRoomEvent {
  type: 'm.room.message'
  content: SygnalMessageContent // e.g. { body: "example text", msgtype: "m.text" }
}

type SygnalEvent = SygnalRoomMemberChange | SygnalRoomMessage | AnonymizedSygnalEvent

const parseToSygnalEvent = (
  remoteData:
    | {
        [p: string]: string
      }
    | undefined
): SygnalEvent | undefined => {
  if (!remoteData) {
    return undefined
  }
  try {
    const { content, ...rest } = remoteData

    return {
      content: content ? JSON.parse(content) : undefined,
      ...rest,
    } as SygnalEvent
  } catch (e) {
    logDebug('parseToSygnalEvent', 'error while parsing', e)
    return undefined
  }
}

const generateNotificationContent = (event: SygnalEvent): NotificationContentInput | undefined => {
  if (event.type === 'm.room.member') {
    const sender = event.sender_display_name
    if (event.membership === 'invite') {
      return {
        title: 'Invitation',
        subtitle: 'Chat',
        body: sender + ' invited you to a ' + (event.content.is_direct ? 'direct chat' : 'chat') + '.',
      }
    } else {
      return {
        title: 'Channel Update',
        subtitle: 'Chat',
        body: sender + ' updated ' + (event.content.is_direct ? 'your direct chat' : 'a chat you are part of') + '.',
      }
    }
  } else if (event.type === 'm.room.message') {
    const sender = event.sender_display_name
    const content = event.content
    if (content.msgtype === 'm.text') {
      return {
        title: `From ${sender}:`,
        subtitle: 'Chat',
        body: content.body,
      }
    } else {
      // basically any content we don't want to implement yet
      return {
        title: 'New Message',
        subtitle: 'Chat',
        body: sender + ' send a new message.',
      }
    }
  } else {
    // anonymized, or unknown event
    // wording it like the notification is intentionally vague
    return {
      title: 'There is an update in the app',
      subtitle: 'Chat',
      body: 'Someone messaged you, invited you to a chat, or updated a chat.',
    }
  }
}

const registerHandleNotificationsWhenAppIsInForeground = () => {
  // see https://docs.expo.dev/versions/latest/sdk/notifications/#setnotificationhandlerhandler
  Notifications.setNotificationHandler({
    handleNotification: async (
      notification: Notifications.Notification
    ): Promise<Notifications.NotificationBehavior> => {
      logDebug('foregroundNotificationHandler', 'received notification', JSON.stringify(notification))
      // defensive programming, since types don't show all null-possibilities
      const request: Partial<Notifications.NotificationRequest> = notification.request
      if (request.trigger?.type === 'push') {
        const trigger = request.trigger as Partial<Notifications.PushNotificationTrigger>
        const event = parseToSygnalEvent(trigger.remoteMessage?.data)
        logDebug('foregroundNotificationHandler', 'using sygnal event', JSON.stringify(event))
        if (event) {
          const content = generateNotificationContent(event)
          logDebug('foregroundNotificationHandler', 'scheduling notification', JSON.stringify(content))
          if (content) {
            await Notifications.scheduleNotificationAsync({
              content,
              trigger: null,
            })
          }
        }

        return {
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }
      }
      return {
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }
    },
    handleSuccess: async (notificationId) => {
      // could be used for tracking
      logDebug('foregroundNotificationHandler', 'notification success', notificationId)
    },
    handleError: async (notificationId, error) => {
      // could be used for custom sentry events
      logDebug('foregroundNotificationHandler', 'notification error', notificationId, error)
    },
  })
}

interface ChatBackgroundNotificationData {
  notification: {
    data: {
      room_id: string
      unread: number
    }
  }
}

const registerHandleNotificationsWhenAppIsInBackground = () => {
  // see https://docs.expo.dev/versions/latest/sdk/notifications/#handle-incoming-notifications-when-the-app-is-1
  const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK'
  const executor: TaskManager.TaskManagerTaskExecutor = (
    body: TaskManager.TaskManagerTaskBody<ChatBackgroundNotificationData>
  ) => {
    // TODO use const roomId = body.data.notification.data.room_id to open the room
    logDebug('backgroundNotificationHandler', 'received a notification in the background!', JSON.stringify(body))
    const unread = body.data.notification.data.unread
    // TODO doesn't work yet
    Notifications.scheduleNotificationAsync({
      content: {
        title: `You have ${unread} unread messages 📬`,
        body: 'Open the app to read them',
      },
      trigger: null,
    }).then()
  }
  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, executor)
  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)
}
