import type { NotificationContentInput } from 'expo-notifications'
import * as Notifications from 'expo-notifications'

import { type Route } from '@react-navigation/native'

import { getLogger } from '@holi/core/helpers/logging'
import { RouteName } from '@holi/mobile/navigation/routeName'
import { NotificationPayload } from '@holi/mobile/notifications'

const logger = getLogger('Notifications')

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
  content_msgtype: string | undefined | 'm.text'
  content_body: string | undefined
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

const parseToSygnalEvent = (payload: NotificationPayload | undefined): SygnalEvent | undefined => {
  if (!payload) {
    return undefined
  }
  try {
    const { content, ...rest } = payload

    return {
      // Android events benefit from parsing the content JSON
      content: content && typeof content === 'string' ? JSON.parse(content) : undefined,
      ...rest,
    } as SygnalEvent
  } catch (e) {
    logger.debug('parseToSygnalEvent', 'error while parsing', e)
    return undefined
  }
}

const isInChatHome = (currentRoute: Route<string> | undefined): boolean => currentRoute?.name === RouteName.ChatHome

const isInSameChatRoom = (pushRoomId: string | undefined, currentRoute: Route<string> | undefined): boolean => {
  const name = currentRoute?.name
  const params = currentRoute?.params
  return name === RouteName.ChatRoom && !!params && 'roomId' in params && params.roomId === pushRoomId
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
  if (event?.content_msgtype === 'm.text') {
    return {
      title: 'New message',
      body: event.content_body,
      data: {
        room_id: event.room_id,
      },
    }
  } else {
    // basically any content we don't want to implement yet
    return {
      title: 'New message',
      body: 'Someone sent you a new message.',
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

export const maybeScheduleChatNotification = async (
  currentRoute: Route<string> | undefined,
  payload: NotificationPayload | undefined
): Promise<void> => {
  const event = parseToSygnalEvent(payload)
  logger.debug('maybeScheduleChatNotification', 'parsed sygnal event', JSON.stringify(event))

  if (event && !isInChatHome(currentRoute) && !isInSameChatRoom(event.room_id, currentRoute)) {
    const content = generateNotificationContent(event)
    if (content) {
      logger.debug('maybeScheduleChatNotification', 'scheduling chat notification', JSON.stringify(content))
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
      logger.debug('maybeScheduleChatNotification', 'ignoring unknown push notification', payload)
    }
  }
  return undefined
}
