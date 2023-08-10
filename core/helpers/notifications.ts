import * as Device from 'expo-device'
import { PermissionStatus } from 'expo-modules-core'
import * as Notifications from 'expo-notifications'
import * as TaskManager from 'expo-task-manager'
import { Platform } from 'react-native'

// TODO remove or user proper logging solution
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const logDebug = (method: string, msg: string, ...args: any[]) =>
  console.debug(`${Device.osName} | ${method} | ${msg}`, ...args)

// TODO deregister notifications, see https://docs.expo.dev/versions/latest/sdk/notifications/#usage
// TODO set configurable properties (e.g. notification icon, color and sound), see https://docs.expo.dev/versions/latest/sdk/notifications/#configurable-properties
// TODO setup background events for iOS, see https://docs.expo.dev/versions/latest/sdk/notifications/#configurable-properties
export const initNotifications = async () => {
  if (!Device.isDevice) {
    return Promise.resolve()
  } else {
    logDebug('initNotifications', 'initializing notifications')

    // TODO understand and validate if this is needed
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.DEFAULT,
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

// TODO handle invite notification:
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

type SygnalData = {
  room_id: string // e.g. "!yYrrLMRIfsHiunBbat:staging.chat.holi.social"
  unread: string // e.g. "1"
  content: string // e.g. {\"body\":\"example text\",\"msgtype\":\"m.text\"}
  type: string // e.g. "m.room.message"
  prio: string // e.g. "high"
  sender: string // e.g. "@malte1:staging.chat.holi.social"
  event_id: string // e.g. "$RZc5AqDDH1Nx3Ru5OeWCennKG5wJcdMQfPOHrv8_1VA"
  sender_display_name: string // e.g. "malte1"
}

type SygnalContent = {
  body?: string // e.g. "example text"
  msgtype?: string // e.g. "m.text"
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
        const data = trigger.remoteMessage?.data as SygnalData | undefined
        const content: SygnalContent | undefined = data?.content ? JSON.parse(data.content) : undefined
        const title = 'New message'
        const subtitle = data?.sender_display_name
        const body = content?.body

        await Notifications.scheduleNotificationAsync({
          content: {
            title,
            subtitle,
            body,
          },
          trigger: null,
        })

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
      // TODO handle properly
      logDebug('foregroundNotificationHandler', 'notification success', notificationId)
      return Promise.resolve()
    },
    handleError: async (notificationId, error) => {
      // TODO handle properly
      logDebug('foregroundNotificationHandler', 'notification error', notificationId, error)
      return Promise.resolve()
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
