import type { NotificationResponse } from 'expo-notifications'

import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'
import {
  CommentReactionPushNotification,
  PostReactionPushNotification,
} from '@holi/mobile/notifications/reactionPushNotifications'
import {
  PostCommentPushNotification,
  SpaceMembershipPushNotification,
  SpacePostPushNotification,
} from '@holi/mobile/notifications/spacePushNotifications'

export type NotificationData = Record<string, unknown>

const logger = getLogger('Notifications')

const extractDataFromNotificationResponse = (
  notificationResponse: NotificationResponse
): NotificationData | undefined => {
  const request = notificationResponse?.notification?.request
  // true when:
  // * iOS - active app push aka. scheduled notification (scheduled by holi app itself when receiving notification while in foreground)
  // * Android - all cases
  if (request?.content?.data) {
    return request?.content?.data
  } else if (request?.trigger?.type === 'push') {
    // iOS - background or closed app push
    // IMHO, expo-notifications should copy this into `request.content.data` but doesn't, so take it from original message
    if (request.trigger.payload) return request.trigger.payload
  }
  return undefined
}

const chatRoomScreenUrlFrom = (data: NotificationData) => {
  const roomId = data?.room_id
  if (roomId && typeof roomId === 'string') {
    logger.debug('createUrlFromChatNotification', 'navigating to room', roomId)
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

const toCommentReactionUrl = (notification: CommentReactionPushNotification) => {
  const parsedData =
    typeof notification?.data === 'string' ? JSON.parse(notification.data) : notification.data || notification
  const {
    comment: { link },
  } = parsedData
  const url = new URL(`holi://${link}`)
  return url.toString()
}

const toPostReactionUrl = (notification: PostReactionPushNotification) => {
  const parsedData =
    typeof notification?.data === 'string' ? JSON.parse(notification.data) : notification.data || notification
  const {
    post: { link },
  } = parsedData
  const url = new URL(`holi://${link}`)
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

const commentUrlFrom = (notification: PostCommentPushNotification) => {
  try {
    const parsedData =
      typeof notification?.data === 'string' ? JSON.parse(notification.data) : notification.data || notification
    let commentLink = parsedData.commentLink
    if (commentLink.startsWith('/')) {
      commentLink = commentLink.substring(1, commentLink.length)
    }
    return 'holi://' + commentLink
  } catch (error) {
    logError(error, 'Failed to create url for post comment notification', {
      location: 'notifications.postCommentUrlFrom',
    })
  }
}

const toSpaceUpdatesUrl = (notification: SpacePostPushNotification): string => {
  const parsedData =
    typeof notification?.data === 'string' ? JSON.parse(notification.data) : notification.data || notification
  const { space } = parsedData
  return `holi://spaces/${space.name}?tab=updates`
}

const spaceUpdatesUrlFrom = (notification: SpacePostPushNotification) => {
  try {
    return toSpaceUpdatesUrl(notification)
  } catch (error) {
    logError(error, 'Failed to create url for post notification', {
      location: 'notifications.spaceUpdatesUrlFrom',
    })
  }
}

const spaceUrl = (notification: NotificationData, tab?: string): string => {
  const { space } = extractData(notification)
  const url = new URL(`holi://spaces/${space.name}`)
  if (tab) {
    url.searchParams.set('tab', tab)
  }
  return url.toString()
}

const spaceAppointmentUrl = (notification: NotificationData, refresh = false) => {
  try {
    const { space, appointment } = extractData(notification)
    const url = new URL(`holi://spaces/${space.name}/appointments/${appointment.id}`)
    if (refresh) {
      url.searchParams.set('refresh', 'true')
    }
    return url.toString()
  } catch (error) {
    logError(error, 'Failed to create url for appointment notification', {
      location: 'notifications.spaceAppointmentUrl',
    })
  }
}

const challengeUrl = (notification: NotificationData) => {
  try {
    const { link } = extractData(notification)

    let url = 'holi://apps/challenges'
    if (link) {
      url += '?path=' + encodeURIComponent(link)
    }
    return new URL(url).toString()
  } catch (error) {
    logError(error, 'Failed to create url for challenges notification', {
      location: 'notifications.challengeUrl',
    })
  }
}

const extractData = (notificationData: NotificationData) =>
  typeof notificationData.data === 'string'
    ? JSON.parse(notificationData.data)
    : notificationData.data || notificationData

const isChatNotification = (data: NotificationData) => !!data.room_id

export const screenUrlFromNotificationResponse = (notificationResponse: NotificationResponse): string | undefined => {
  logger.debug('screenUrlFromNotificationResponse', 'response', JSON.stringify(notificationResponse))
  const data: NotificationData | undefined = extractDataFromNotificationResponse(notificationResponse)
  if (!data) {
    return undefined
  }
  logger.debug('screenUrlFromNotificationResponse', 'data', data)
  if (isChatNotification(data)) {
    return chatRoomScreenUrlFrom(data)
  } else {
    switch (data.notificationType) {
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
        return spaceMemberShipUrlFrom(data as unknown as SpaceMembershipPushNotification)
      case NovuNotificationType.POST_COMMENT_MENTION:
      case NovuNotificationType.POST_COMMENT_AUTHOR:
        return commentUrlFrom(data as unknown as PostCommentPushNotification)
      case NovuNotificationType.SPACE_NEW_POST:
        return spaceUpdatesUrlFrom(data as unknown as SpacePostPushNotification)
      case NovuNotificationType.SPACE_APPOINTMENT_CREATION:
        return spaceAppointmentUrl(data)
      case NovuNotificationType.SPACE_APPOINTMENT_UPDATE:
        return spaceAppointmentUrl(data, true)
      case NovuNotificationType.SPACE_APPOINTMENT_DELETION:
        return spaceUrl(data, 'involvement')
      case NovuNotificationType.CHALLENGE_APPROVAL:
      case NovuNotificationType.CHALLENGE_NEW_COMMENT:
      case NovuNotificationType.CHALLENGE_LEVEL_UP_HOLI_QUEST:
      case NovuNotificationType.CHALLENGE_KEEP_STREAK:
        return challengeUrl(data)
      case NovuNotificationType.POST_REACTION:
        return toPostReactionUrl(data as unknown as PostReactionPushNotification)
      case NovuNotificationType.COMMENT_REACTION:
        return toCommentReactionUrl(data as unknown as CommentReactionPushNotification)
      default:
        return undefined
    }
  }
}
