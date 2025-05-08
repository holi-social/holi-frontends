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
import type { TaskManagerTaskBody } from 'expo-task-manager'
import { Platform } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { isDevice } from '@holi/core/helpers/isDevice'
import { getLogger } from '@holi/core/helpers/logging'
import { initDeviceToken, markDeviceTokenAsInitialized } from '@holi/core/screens/notifications/helpers/useDeviceToken'
import { navigationRef } from '@holi/mobile/navigation/NavigationProvider'
import { isChatNotification, maybeScheduleChatNotification } from '@holi/mobile/notifications/chatNotifications'
import type { NotificationData } from '@holi/mobile/notifications/index'

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

const parseNotificationPayload = (request: Partial<NotificationRequest>): NotificationData => {
  const trigger = request.trigger as Partial<PushNotificationTrigger>
  return trigger.remoteMessage?.data /* Android */ ?? trigger.payload /* iOS */ ?? {}
}

const handleNotification = async (notification: Notification): Promise<NotificationBehavior> => {
  // defensive programming, since types don't show all null-possibilities
  const request: Partial<NotificationRequest> = notification.request
  if ((request.trigger as PushNotificationTrigger)?.type === 'push') {
    const data = parseNotificationPayload(request)
    // Only chat notifications may be displayed in the foreground
    // It's a product decision, that Novu notifications are not shown while the App is active
    if (isChatNotification(data)) {
      const currentRoute = navigationRef.current?.getCurrentRoute()
      await maybeScheduleChatNotification(currentRoute, data)
    }
    // Push Notifications are never shown directly
    return {
      shouldShowAlert: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }
  }
  // Scheduled notifications are always shown
  return {
    shouldShowAlert: true,
    shouldPlaySound: true, // Android: only with `shouldPlaySound: true`, the notification pops over the screen
    shouldSetBadge: false,
  }
}

const registerHandleNotificationsWhenAppIsInForeground = () => {
  // see https://docs.expo.dev/versions/latest/sdk/notifications/#setnotificationhandlerhandler
  Notifications.setNotificationHandler({
    handleNotification: async (notification: Notification): Promise<NotificationBehavior> => {
      logger.debug('foregroundNotificationHandler', 'received notification', JSON.stringify(notification))
      return handleNotification(notification)
    },
    handleSuccess: async (notificationId) => {
      // could be used for tracking
      logger.debug('foregroundNotificationHandler', 'notification success', notificationId)
    },
    handleError: async (notificationId, error) => {
      logError(error, 'Failed to handle foreground notification', {
        location: 'initNotifications.foregroundNotificationHandler',
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
