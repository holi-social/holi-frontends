import type { NotificationResponse, PushNotificationTrigger } from 'expo-notifications'

import { logError } from '@holi/core/errors/helpers'
import { logDebug } from '@holi/core/helpers/logging'
import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import {
  PostCommentPushNotification,
  PostPushNotification,
  SpaceMembershipPushNotification,
} from '@holi/mobile/notifications/pushNotifications'

export type NotificationPayload = Record<string, unknown>

const extractPayloadFromNotification = (response: Partial<NotificationResponse>): NotificationPayload | undefined => {
  const request = response?.notification?.request
  if (request?.trigger?.type === 'push') {
    // background or closed app push
    const trigger = request.trigger as Partial<PushNotificationTrigger>
    const triggerData = trigger?.remoteMessage?.data ?? trigger.payload // android ?? ios
    if (triggerData) {
      return triggerData
    }
  } else if (request?.content?.data) {
    // active app push
    return request?.content?.data
  }
}

const createUrlFromChatNotification = (data: NotificationPayload) => {
  const roomId = data?.room_id
  if (roomId && typeof roomId === 'string') {
    logDebug('createUrlFromChatNotification', 'navigating to room', roomId)
    return 'holi://chat/rooms/' + roomId
  }
}

const toSpacePendingCollaboratorsManagementUrl = (
  notification: SpaceMembershipPushNotification,
  refresh = false
): string => {
  const parsedData =
    typeof notification?.data === 'string' ? JSON.parse(notification.data) : notification.data || notification
  const { space, user } = parsedData
  const url = new URL(`holi://spaces/${space.name}/collaborators/manage`)
  url.searchParams.set('tab', 'pending')
  if (user?.id) {
    url.searchParams.set('userId', user?.id)
  }
  if (refresh) {
    url.searchParams.set('refresh', 'true')
  }
  return url.toString()
}

const toSpaceUrl = (notification: SpaceMembershipPushNotification, refresh = false): string => {
  const parsedData =
    typeof notification?.data === 'string' ? JSON.parse(notification.data) : notification.data || notification
  const { space } = parsedData
  const url = new URL(`holi://spaces/${space.name}`)
  if (refresh) {
    url.searchParams.set('refresh', 'true')
  }
  return url.toString()
}

const spaceMemberShipUrlFrom = (notification: SpaceMembershipPushNotification) => {
  const refresh = [
    NovuNotificationType.SPACE_MEMBERSHIP_REQUEST,
    NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_USER,
    NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_ADMIN,
    NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_USER,
    NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_ADMIN,
  ].includes(notification.notificationType)
  try {
    switch (notification.notificationType) {
      case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST:
        return toSpacePendingCollaboratorsManagementUrl(notification, refresh)
      case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_USER:
      case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_ADMIN:
      case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_ADMIN:
      case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_USER:
      case NovuNotificationType.SPACE_MEMBERSHIP_INVITE:
      case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_USER:
      case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_ADMIN:
      case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_USER:
      case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_ADMIN:
        return toSpaceUrl(notification, refresh)
    }
  } catch (error) {
    logError(error, 'Failed to create url for space membership notification', {
      location: 'notifications.createUrlFromSpaceMembershipNotification',
    })
  }
}

const toPostCommentUrl = (notification: PostCommentPushNotification): string => {
  const parsedData =
    typeof notification?.data === 'string' ? JSON.parse(notification.data) : notification.data || notification
  const { post, comment } = parsedData
  return `holi://posts/${post.id}?commentId=${comment.id}`
}

const toPostUrl = (notification: PostPushNotification): string => {
  const parsedData =
    typeof notification?.data === 'string' ? JSON.parse(notification.data) : notification.data || notification
  const { post } = parsedData
  return `holi://posts/${post.id}`
}

const postCommentUrlFrom = (notification: PostCommentPushNotification) => {
  try {
    switch (notification.notificationType) {
      case NovuNotificationType.POST_COMMENT_MENTION:
      case NovuNotificationType.POST_COMMENT_AUTHOR:
        return toPostCommentUrl(notification)
    }
  } catch (error) {
    logError(error, 'Failed to create url for post comment notification', {
      location: 'notifications.postCommentUrlFrom',
    })
  }
}

const postUrlFrom = (notification: PostPushNotification) => {
  try {
    return toPostUrl(notification)
  } catch (error) {
    logError(error, 'Failed to create url for post notification', {
      location: 'notifications.postUrlFrom',
    })
  }
}

export const transformPushInteractionToUrl = (response: Partial<NotificationResponse>) => {
  const payload: NotificationPayload | undefined = extractPayloadFromNotification(response)
  if (!payload) {
    return null
  }
  switch (payload.notificationType) {
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST:
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_USER:
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_APPROVAL_ADMIN:
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_ADMIN:
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST_DECLINE_USER:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_USER:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_APPROVAL_ADMIN:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_USER:
    case NovuNotificationType.SPACE_MEMBERSHIP_INVITE_DECLINE_ADMIN:
      return spaceMemberShipUrlFrom(payload as unknown as SpaceMembershipPushNotification)
    case NovuNotificationType.POST_COMMENT_MENTION:
    case NovuNotificationType.POST_COMMENT_AUTHOR:
      return postCommentUrlFrom(payload as unknown as PostCommentPushNotification)
    case NovuNotificationType.SPACE_NEW_POST:
      return postUrlFrom(payload as unknown as PostPushNotification)
    default:
      // Default is chat notification
      return createUrlFromChatNotification(payload)
  }
}
