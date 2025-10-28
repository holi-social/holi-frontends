import { gql } from '@apollo/client'

import { UserAvatarFragment } from '@holi/core/domain/shared/queries'
import type { Notification } from '@holi/core/screens/notifications/components/types'
import type { Paged } from '@holi/core/types'

export type NumberOfItems = {
  numberOfItems: number
}

// TODO: add "post", "postComment", "space" into options
export const notificationsQuery = gql`
  ${UserAvatarFragment}

  query Notifications($offset: Int! = 0, $limit: Int! = 100) {
    notifications(offset: $offset, limit: $limit) {
      data {
        id
        notificationType
        owner {
          ...UserAvatar
        }
        created
        read
        options {
          post {
            id
            title
            isPublic
            creator {
              ...UserAvatar
            }
          }
          user {
            ...UserAvatar
          }
          postComment {
            id
            post {
              id
            }
            language
          }
          space {
            id
            title
            name
            avatar
            avatarDefaultColor
          }
          teaser
          message
        }
      }
      totalResults
    }
  }
`

export type NotificationsResponse = {
  notifications: Paged<Notification>
}

export type NewNotificationStatus = {
  id: string
  status: boolean
}

export const HasNewNotificationsQuery = gql`
  query hasNewNotifications {
    hasNewNotifications {
      id
      status
    }
  }
`

export type HasNewNotificationsResponse = {
  hasNewNotifications: NewNotificationStatus
}

export const LastSeenNotificationMutation = gql`
  mutation LastSeenNotificationMutation($notificationId: UUID!) {
    lastSeenNotification(notificationId: $notificationId) {
      id
      status
    }
  }
`

export type lastSeenNotificationResponse = {
  lastSeenNotification: NewNotificationStatus
}

export interface NotificationsChannelPreferences {
  push: boolean | null
  email: boolean | null
}

export interface NotificationsWorkflowPreferences {
  id: string
  category: string
  preferences: NotificationsChannelPreferences
}

export interface NotificationsPreferencesResponse {
  notifications_preferences: NotificationsWorkflowPreferences[]
}

export const notificationsPreferencesQuery = gql`
  query NotificationsPreferences {
    notifications_preferences {
      id
      category
      preferences {
        push
        email
      }
    }
  }
`
