import type { NotificationResponse, PushNotificationTrigger } from 'expo-notifications'

import { logError } from '@holi/core/errors/helpers'
import { logDebug } from '@holi/core/helpers/logging'
import { NovuNotificationType } from '@holi/core/screens/notifications/components/novu/types'

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

const createUrlFromSpaceMembershipNotification = (data: NotificationPayload) => {
  try {
    const parsedData = typeof data?.data === 'string' ? JSON.parse(data.data) : data.data || data
    const { space, user } = parsedData
    if (space?.name) {
      const spaceCollaboratorsUrl = `holi://spaces/${space.name}/collaborators/manage?tab=pending`
      const userParameter = user?.id ? `&userId=${user?.id}` : ''
      const url = spaceCollaboratorsUrl + userParameter
      logDebug('notifications.createUrlFromSpaceMembershipNotification', 'created url', url)
      return url
    }
  } catch (error) {
    logError(error, 'Failed to create url for space membership notification', {
      location: 'notifications.createUrlFromSpaceMembershipNotification',
    })
  }
}

export const transformPushInteractionToUrl = (response: Partial<NotificationResponse>) => {
  const payload = extractPayloadFromNotification(response)
  if (!payload) {
    return null
  }
  switch (payload.notificationType) {
    case NovuNotificationType.SPACE_MEMBERSHIP_REQUEST:
      return createUrlFromSpaceMembershipNotification(payload)
    default:
      // Default is chat notification
      return createUrlFromChatNotification(payload)
  }
}
