import type { NotificationResponse, PushNotificationTrigger } from 'expo-notifications'

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

export type NotificationPayload = Record<string, unknown>

const logger = getLogger('Notifications')

const extractPayloadFromNotification = (response: NotificationResponse): NotificationPayload | undefined => {
  const request = response?.notification?.request
  if (request?.trigger?.type === 'push') {
    // background or closed app push
    const trigger = request.trigger as Partial<PushNotificationTrigger>
    const triggerData = trigger?.remoteMessage?.data ?? trigger.payload // android ?? ios
    if (triggerData) {
      return triggerData
    }
  }
  if (request?.content?.data) {
    // active app push
    return request?.content?.data
  }
}

const createUrlFromChatNotification = (data: NotificationPayload) => {
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

const spaceUrl = (notification: NotificationPayload, tab?: string): string => {
  const { space } = extractData(notification)
  const url = new URL(`holi://spaces/${space.name}`)
  if (tab) {
    url.searchParams.set('tab', tab)
  }
  return url.toString()
}

const spaceAppointmentUrl = (notification: NotificationPayload, refresh = false) => {
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

const challengeUrl = (notification: NotificationPayload) => {
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

const extractData = (notification: NotificationPayload) => {
  const data = typeof notification.data === 'string' ? JSON.parse(notification.data) : notification.data || notification
  return data
}

const isChatNotification = (notification: NotificationPayload) => !!notification.room_id

export const transformPushInteractionToUrl = (response: NotificationResponse) => {
  const payload: NotificationPayload | undefined = extractPayloadFromNotification(response)
  if (!payload) {
    return null
  }

  logger.debug('transformPushInteractionToUrl', 'payload', payload)
  if (isChatNotification(payload)) {
    return createUrlFromChatNotification(payload)
  } else {
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
        return commentUrlFrom(payload as unknown as PostCommentPushNotification)
      case NovuNotificationType.SPACE_NEW_POST:
        return spaceUpdatesUrlFrom(payload as unknown as SpacePostPushNotification)
      case NovuNotificationType.SPACE_APPOINTMENT_CREATION:
        return spaceAppointmentUrl(payload)
      case NovuNotificationType.SPACE_APPOINTMENT_UPDATE:
        return spaceAppointmentUrl(payload, true)
      case NovuNotificationType.SPACE_APPOINTMENT_DELETION:
        return spaceUrl(payload, 'involvement')
      case NovuNotificationType.CHALLENGE_APPROVAL:
      case NovuNotificationType.CHALLENGE_NEW_COMMENT:
      case NovuNotificationType.CHALLENGE_LEVEL_UP_HOLI_QUEST:
      case NovuNotificationType.CHALLENGE_KEEP_STREAK:
        return challengeUrl(payload)
      case NovuNotificationType.POST_REACTION:
        return toPostReactionUrl(payload as unknown as PostReactionPushNotification)
      case NovuNotificationType.COMMENT_REACTION:
        return toCommentReactionUrl(payload as unknown as CommentReactionPushNotification)
      default:
        return null
    }
  }
}
