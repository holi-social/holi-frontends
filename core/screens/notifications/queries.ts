import { gql } from '@apollo/client/core'

import { Notification } from '@holi/core/screens/notifications/components/types'
import { FullUserAvatarFragment } from '@holi/core/screens/userprofile/queries'
import { Paged } from '@holi/core/types'

export type NumberOfItems = {
  numberOfItems: number
}

// TODO: add "post", "postComment", "space" into options
export const notificationsQuery = gql`
  ${FullUserAvatarFragment}

  query Notifications($offset: Int, $limit: Int) {
    notifications(offset: $offset, limit: $limit) {
      data {
        id
        notificationType
        owner {
          ...FullUserAvatar
        }
        created
        read
        options {
          post {
            id
            title
            isPublic
            creator {
              ...FullUserAvatar
            }
          }
          user {
            ...FullUserAvatar
          }
          postComment {
            id
            post {
              id
            }
          }
          space {
            id
            title
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

export const HasNewNotifcationsQuery = gql`
  query hasNewNotifications {
    hasNewNotifications {
      id
      status
    }
  }
`

export type HasNewNotifcationsResponse = {
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
