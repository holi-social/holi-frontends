import AsyncStore from '@react-native-async-storage/async-storage'
import { PermissionStatus } from 'expo-modules-core'
import type {
  Notification,
  NotificationBehavior,
  NotificationRequest,
  PushNotificationTrigger,
} from 'expo-notifications'
import * as Notifications from 'expo-notifications'
import * as TaskManager from 'expo-task-manager'
import { TaskManagerTaskBody } from 'expo-task-manager'
import { Platform } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { isDevice } from '@holi/core/helpers/isDevice'
import { getLogger } from '@holi/core/helpers/logging'
import { initDeviceToken, markDeviceTokenAsInitialized } from '@holi/core/screens/notifications/helpers/useDeviceToken'
import { navigationRef } from '@holi/mobile/navigation/NavigationProvider'
import { maybeScheduleChatNotification } from '@holi/mobile/notifications/chatNotifications'
import { NotificationPayload } from '@holi/mobile/notifications/index'

const logger = getLogger('Notifications')

const permissionRequestedStorageKey = 'notification_permission_requested'

const getOrRequestNotificationPermission = async (): Promise<PermissionStatus> => {
  let response = await Notifications.getPermissionsAsync()
  if (response.status === PermissionStatus.GRANTED) {
    return response.status
  }

  const alreadyRequestedPermission = await AsyncStore.getItem(permissionRequestedStorageKey)?.then(
    (storedValue) => !!storedValue
  )

  // Make sure to request the permission at least once, if it's denied initially
  if (response.status === PermissionStatus.UNDETERMINED || !alreadyRequestedPermission) {
    response = await Notifications.requestPermissionsAsync()
    AsyncStore.setItem(permissionRequestedStorageKey, 'true')
  }

  return response.status
}

export const initNotifications = async () => {
  if (!isDevice()) {
    // doesn't work on android emulator (and also possibly not on iOS simulator)
    markDeviceTokenAsInitialized()
    return Promise.resolve()
  } else {
    logger.debug('initNotifications', 'initializing notifications')
    const responseStatus = await getOrRequestNotificationPermission()
    logger.debug('initNotifications', 'permission response', responseStatus)

    // iOS also has PROVISIONAL and EPHEMERAL, but we don't request those, so we are fine
    if (responseStatus === PermissionStatus.GRANTED) {
      logger.debug(
        'initNotifications',
        'notification permissions granted, setting up notificationHandler and device token'
      )

      initDeviceToken()

      // permanent, no de-registration needed
      registerHandleNotificationsWhenAppIsInForeground()
    } else {
      markDeviceTokenAsInitialized()
    }
  }
}

const notificationType = (notification: Notification): 'push' | 'scheduled' =>
  (notification.request as Partial<NotificationRequest>).trigger?.type === 'push' ? 'push' : 'scheduled'

const parseNotificationPayload = (notification: Notification): NotificationPayload => {
  const request: Partial<NotificationRequest> = notification.request
  const trigger = request.trigger as Partial<PushNotificationTrigger>
  return trigger.remoteMessage?.data /* Android */ ?? trigger.payload /* iOS */ ?? {}
}

export const pushNotificationSource = (payload: NotificationPayload): 'novu' | 'chat' => {
  // all Novu notifications have `notificationType` and we currently only have notifications from Novu and Sygnal
  return payload?.notificationType ? 'novu' : 'chat'
}

// gets called when:
// * for every notification when app is in foreground received via FCM / APNS
// * for every notification scheduled via scheduleNotificationsAsync from within our app code
const handleNotification = async (notification: Notification): Promise<NotificationBehavior> => {
  switch (notificationType(notification)) {
    case 'scheduled': {
      logger.debug('handleNotification', 'displaying scheduled notification', notification)
      return {
        shouldShowAlert: true,
        shouldPlaySound: true, // Android: only with `shouldPlaySound: true`, the notification pops over the screen
        shouldSetBadge: false,
      }
    }
    case 'push': {
      const payload = parseNotificationPayload(notification)
      switch (pushNotificationSource(payload)) {
        case 'novu': {
          // conscious product decision: if the user has the app open, we don't want to bug them with notifications
          // in-app unread notification count should suffice
          logger.debug(
            'handleNotification',
            'not displaying novu notification because app is in foreground',
            notification
          )
          return {
            shouldShowAlert: false,
            shouldPlaySound: false,
            shouldSetBadge: false,
          }
        }
        case 'chat': {
          const currentRoute = navigationRef.current?.getCurrentRoute()
          // chat push notifications don't come in a form that can be rendered as notifications directly
          // maybeScheduleChatNotification transforms them such that they can
          await maybeScheduleChatNotification(currentRoute, payload)
          logger.debug('handleNotification', 'maybeScheduleChatNotification done, return not to display')
          return {
            shouldShowAlert: false,
            shouldPlaySound: false,
            shouldSetBadge: false,
          }
        }
      }
    }
  }
}

const registerHandleNotificationsWhenAppIsInForeground = () => {
  // see https://docs.expo.dev/versions/latest/sdk/notifications/#setnotificationhandlerhandler
  Notifications.setNotificationHandler({
    handleNotification: async (notification: Notification): Promise<NotificationBehavior> => {
      logger.debug('handleNotification', 'received notification', JSON.stringify(notification))
      return handleNotification(notification)
    },
    handleSuccess: async (notificationId) => {
      // could be used for tracking
      logger.debug('handleNotification', 'notification success', notificationId)
    },
    handleError: async (notificationId, error) => {
      logError(error, 'Failed to handle notification', {
        location: 'initNotifications.handleNotification',
        notificationId,
      })
    },
  })
}

// Has to be executed in global context, i.e. outside of react components
export const registerHandleNotificationsWhenAppIsInBackground = async () => {
  if (Platform.OS === 'android') {
    // since we don't really need it, we can skip the hassle for ios right now

    // see https://docs.expo.dev/versions/latest/sdk/notifications/#handle-incoming-notifications-when-the-app-is-1
    const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK'
    TaskManager.defineTask(
      BACKGROUND_NOTIFICATION_TASK,
      async ({ data, error, executionInfo }: TaskManagerTaskBody) => {
        try {
          if (error) {
            logError(error, 'Error in background notification handler', {
              location: 'initNotifications.backgroundNotificationHandler',
              ...executionInfo,
            })
            return
          }
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const notification = (data as any).notification
          logger.debug(
            'backgroundNotificationHandler',
            'received background notification',
            JSON.stringify(notification)
          )
          // This is just left in to demonstrate how to receive notifications in the background.
          // We can't prevent background notifications from appearing when they have a valid notification payload.
          // But we need this handler for closed app notifications, so we should not send another notification here.
        } catch (e) {
          logError(e, 'Error processing background notification', {
            location: 'initNotifications.backgroundNotificationHandler',
            ...executionInfo,
          })
        }
      }
    )
    await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)
  }
}
