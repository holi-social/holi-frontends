import * as Notifications from 'expo-notifications'
import type { NotificationContentInput } from 'expo-notifications'

import { logDebug } from '@holi/core/helpers/logging'
import { navigationRef } from '@holi/mobile/navigation/NavigationProvider'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { NotificationPayload } from '@holi/mobile/notifications'

interface AndroidUnknownMessageContent {
  msgtype: string | undefined
  body: string | undefined
}

interface AndroidMessageContentText {
  msgtype: 'm.text'
  body: string // e.g. "example text"
}

type AndroidMessageContent = AndroidMessageContentText | AndroidUnknownMessageContent

interface AndroidMemberChangeContent {
  is_direct: boolean
  displayname: string
  membership: 'invite' | string
}

interface BaseEvent {
  // for all we know, these two are always present,
  // but just to be sure we mark them as optional
  event_id?: string // e.g. "$RZc5AqDDH1Nx3Ru5OeWCennKG5wJcdMQfPOHrv8_1VA"
  room_id?: string // e.g. "!yYrrLMRIfsHiunBbat:staging.chat.holi.social"
}

interface AndroidEventAnonymized extends BaseEvent {
  // type etc. not available if 'event_id_only' is configured in pusher
  type: undefined
  content: undefined
  sender: undefined
  sender_display_name: undefined
}

interface AndroidBaseEvent extends BaseEvent {
  prio: string // e.g. "high"
  unread: string // e.g. "1"
  sender: string // e.g. "@malte1:staging.chat.holi.social"
  sender_display_name: string // e.g. "malte1"
}

interface AndroidRoomMemberChange extends AndroidBaseEvent {
  type: 'm.room.member'
  content: AndroidMemberChangeContent
  membership: 'invite' | string
}

interface AndroidRoomMessage extends AndroidBaseEvent {
  type: 'm.room.message'
  content: AndroidMessageContent // e.g. { body: "example text", msgtype: "m.text" }
}

interface IosMessageWithContent extends BaseEvent {
  aps: {
    badge: number
    alert: {
      'loc-key': 'MSG_FROM_USER_WITH_CONTENT'
      'loc-args': [string, string] // sender + content
    }
  }
}

interface IosEventAnonymized extends BaseEvent {
  aps: {
    badge: number
    alert: object | undefined
  }
}

type SygnalEvent =
  | AndroidRoomMemberChange
  | AndroidRoomMessage
  | AndroidEventAnonymized
  | IosMessageWithContent
  | IosEventAnonymized

const parseToSygnalEvent = (
  remoteData:
    | {
        [key: string]: unknown
      }
    | undefined
): SygnalEvent | undefined => {
  if (!remoteData) {
    return undefined
  }
  try {
    const { content, ...rest } = remoteData

    return {
      // Android events benefit from parsing the content JSON
      content: content && typeof content === 'string' ? JSON.parse(content) : undefined,
      ...rest,
    } as SygnalEvent
  } catch (e) {
    logDebug('parseToSygnalEvent', 'error while parsing', e)
    return undefined
  }
}

const navigationStateAllowsPushDisplayFor = (pushRoomId: string | undefined): boolean => {
  const currentRoute = navigationRef.current?.getCurrentRoute()
  const name = currentRoute?.name
  const params = currentRoute?.params
  const isInChatHome = name === RouteName.ChatHome
  const isInSameRoom = name === RouteName.ChatRoom && !!params && 'roomId' in params && params.roomId === pushRoomId
  return !isInChatHome && !isInSameRoom
}

const createIosMessagePush = (locArgs: [string, string], roomId: string | undefined) => {
  // first arg is the sender display name, currently not in sync with okuna
  const [, message] = locArgs
  return {
    title: 'New message',
    body: message,
    data: {
      room_id: roomId,
    },
  }
}

const createAndroidRoomMemberChangePush = (event: AndroidRoomMemberChange): NotificationContentInput | null => {
  // const sender = memberChange.sender_display_name // currently not in sync with okuna
  if (event.membership === 'invite') {
    return {
      title: 'Invitation',
      body: 'Someone invited you to a ' + (event.content.is_direct ? 'direct chat' : 'chat') + '.',
      data: {
        room_id: event.room_id,
      },
    }
  } else {
    return {
      title: 'Channel Update',
      body: 'Someone updated ' + (event.content.is_direct ? 'your direct chat' : 'a chat you are part of') + '.',
      data: {
        room_id: event.room_id,
      },
    }
  }
}

const createAndroidRoomMessagePush = (event: AndroidRoomMessage) => {
  // const sender = roomMessage.sender_display_name // currently not in sync with okuna
  const content = event.content
  if (content.msgtype === 'm.text') {
    return {
      title: 'New message',
      body: content.body,
      data: {
        room_id: event.room_id,
      },
    }
  } else {
    // basically any content we don't want to implement yet
    return {
      title: 'New Message',
      body: 'Someone send you a new message.',
      data: {
        room_id: event.room_id,
      },
    }
  }
}

const generateNotificationContent = (event: SygnalEvent): NotificationContentInput | null => {
  if (
    'aps' in event &&
    event.aps.alert &&
    'loc-key' in event.aps.alert &&
    event.aps.alert['loc-key'] === 'MSG_FROM_USER_WITH_CONTENT' &&
    event.aps.alert['loc-args'].length >= 2
  ) {
    return createIosMessagePush(event.aps.alert['loc-args'], event.room_id)
  } else if ('type' in event && event.type === 'm.room.member') {
    return createAndroidRoomMemberChangePush(event)
  } else if ('type' in event && event.type === 'm.room.message') {
    return createAndroidRoomMessagePush(event)
  } else {
    // anonymized, or unknown event
    // since the relevance is not known, we don't display anything
    // (e.g. badge update data push notifications are not worth pushing to the user)
    return null
  }
}

export const isChatNotification = (data: NotificationPayload | undefined) => !data?.notification_type

export const handleForegroundChatMessage = async (data: NotificationPayload | undefined) => {
  const event = parseToSygnalEvent(data)
  logDebug('handleForegroundChatMessage', 'using sygnal event', JSON.stringify(event))
  if (event && navigationStateAllowsPushDisplayFor(event.room_id)) {
    const content = generateNotificationContent(event)
    if (content) {
      logDebug('handleForegroundChatMessage', 'scheduling notification', JSON.stringify(content))
      await Notifications.scheduleNotificationAsync({
        content,
        // Android:
        // - automatically uses a notification channel that supports pop over screen and sound
        // TODO(SF) check this in HOLI-6190
        // - Disclaimer: last time we checked, providing a (valid) notification channel id
        //   caused an error "Failed to schedule notification" and we don't know why
        trigger: null, // `null` means to schedule directly
      })
    } else {
      logDebug('handleForegroundChatMessage', 'skipping push notification')
    }
  }
}
