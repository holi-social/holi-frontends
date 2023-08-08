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

const registerHandleNotificationsWhenAppIsInForeground = () => {
  // see https://docs.expo.dev/versions/latest/sdk/notifications/#setnotificationhandlerhandler
  Notifications.setNotificationHandler({
    handleNotification: async (notification: Notifications.Notification) => {
      // TODO handle properly
      logDebug('foregroundNotificationHandler', 'received notification', JSON.stringify(notification))
      notification.request.content.title = 'new message'
      if (notification.request.trigger.type === 'push') {
        // TODO doesn't work yet
        const trigger = notification.request.trigger as Notifications.PushNotificationTrigger
        const unread = trigger.remoteMessage?.data.unread
        notification.request.content.body = unread + ' unread messages'
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
      trigger: {
        seconds: 0,
        channelId: 'default', // TODO use constant
      },
    }).then()
  }
  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, executor)
  Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)
}
