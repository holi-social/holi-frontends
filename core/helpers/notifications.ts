import { PermissionStatus } from 'expo-modules-core'
import * as Notifications from 'expo-notifications'
import {
  Notification,
  NotificationBehavior,
  NotificationContentInput,
  NotificationRequest,
  PushNotificationTrigger,
} from 'expo-notifications'
import * as TaskManager from 'expo-task-manager'
import { TaskManagerTaskBody } from 'expo-task-manager'

import { isDevice } from '@holi/core/helpers/isDevice'
import { logDebug } from '@holi/core/helpers/logging'

// TODO setup background events for iOS, see https://docs.expo.dev/versions/latest/sdk/notifications/#configurable-properties
export const initNotifications = async () => {
  if (!isDevice()) {
    // doesn't work on android emulator (and also possibly not on iOS simulator)
    return Promise.resolve()
  } else {
    logDebug('initNotifications', 'initializing notifications')
    let response = await Notifications.getPermissionsAsync()

    if (response.status === PermissionStatus.UNDETERMINED) {
      response = await Notifications.requestPermissionsAsync()
    }

    // TODO ensure that also provisional and ephemeral is covered by this GRANTED interpretation, see https://docs.expo.dev/versions/latest/sdk/notifications/#interpret-the-ios-permissions-response
    if (response.status === PermissionStatus.GRANTED) {
      logDebug('initNotifications', 'notification permissions granted, setting up notificationHandler')
      // permanent, no de-registration needed
      registerHandleNotificationsWhenAppIsInForeground()
      // permanent, no de-registration needed
      await registerHandleNotificationsWhenAppIsInBackground()
    }
  }
}

interface UnknownSygnalMessageContent {
  msgtype: unknown
  body: unknown
}

interface UnimplementedSygnalMessageContent extends UnknownSygnalMessageContent {
  msgtype: undefined // anything, just using undefined to have no overlap with real values
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
    const memberChange: SygnalRoomMemberChange = event // just to be explicit
    // const sender = memberChange.sender_display_name // currently not in sync with okuna
    if (memberChange.membership === 'invite') {
      return {
        title: 'Invitation',
        body: 'Someone invited you to a ' + (memberChange.content.is_direct ? 'direct chat' : 'chat') + '.',
        data: {
          room_id: memberChange.room_id,
        },
      }
    } else {
      return {
        title: 'Channel Update',
        body:
          'Someone updated ' + (memberChange.content.is_direct ? 'your direct chat' : 'a chat you are part of') + '.',
        data: {
          room_id: memberChange.room_id,
        },
      }
    }
  } else if (event.type === 'm.room.message') {
    const roomMessage: SygnalRoomMessage = event // just to be explicit
    // const sender = roomMessage.sender_display_name // currently not in sync with okuna
    const content = roomMessage.content
    if (content.msgtype === 'm.text') {
      return {
        title: 'New message',
        body: content.body,
        data: {
          room_id: roomMessage.room_id,
        },
      }
    } else {
      // basically any content we don't want to implement yet
      return {
        title: 'New Message',
        body: 'Someone send you a new message.',
        data: {
          room_id: roomMessage.room_id,
        },
      }
    }
  } else {
    // anonymized, or unknown event
    // wording it like the notification is intentionally vague
    return {
      title: 'holi Chat',
      body: 'You have a new message or invitation.',
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        room_id: (event as any).room_id, // if available, use it
      },
    }
  }
}

const handleNewDataPush = async (data: { [p: string]: string } | undefined) => {
  const event = parseToSygnalEvent(data)
  logDebug('handleNewDataPush', 'using sygnal event', JSON.stringify(event))
  if (event) {
    const content = generateNotificationContent(event)
    logDebug('handleNewDataPush', 'scheduling notification', JSON.stringify(content))
    if (content) {
      await Notifications.scheduleNotificationAsync({
        content,
        // Android:
        // - automatically uses a notification channel that supports pop over screen and sound
        // - Disclaimer: last time we checked, providing a (valid) notification channel id
        //   caused an error "Failed to schedule notification" and we don't know why
        trigger: null, // `null` means to schedule directly
      })
    }
  }
}

const registerHandleNotificationsWhenAppIsInForeground = () => {
  // see https://docs.expo.dev/versions/latest/sdk/notifications/#setnotificationhandlerhandler
  Notifications.setNotificationHandler({
    handleNotification: async (notification: Notification): Promise<NotificationBehavior> => {
      logDebug('foregroundNotificationHandler', 'received notification', JSON.stringify(notification))
      // defensive programming, since types don't show all null-possibilities
      const request: Partial<NotificationRequest> = notification.request
      if (request.trigger?.type === 'push') {
        const trigger = request.trigger as Partial<PushNotificationTrigger>
        // TODO don't schedule when chat screen is visible
        await handleNewDataPush(trigger.remoteMessage?.data)
        return {
          shouldShowAlert: false,
          shouldPlaySound: false,
          shouldSetBadge: false,
        }
      }
      // Android: only with `shouldPlaySound: true`, the notification pops over the screen
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
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

const registerHandleNotificationsWhenAppIsInBackground = async () => {
  // see https://docs.expo.dev/versions/latest/sdk/notifications/#handle-incoming-notifications-when-the-app-is-1
  const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND-NOTIFICATION-TASK'
  TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async (body: TaskManagerTaskBody) => {
    try {
      // we know it's a chat notification update
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const notification = (body as any).data.notification
      logDebug('backgroundNotificationHandler', 'received background notification', JSON.stringify(notification))
      // This is just left in to demonstrate how to receive notifications in the background.
      // We can't prevent background notifications from appearing when they have a valid notification payload.
      // But we need this payload for closed app notifications, so we should not send another notification here.
    } catch (e) {
      logDebug('backgroundNotificationHandler', 'error while processing', e)
    }
  })
  await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK)
}
