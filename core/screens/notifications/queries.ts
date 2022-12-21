import { gql } from '@apollo/client/core'

import { Notification } from '@holi/core/screens/notifications/components/types'
import { userAvatarFragment } from '@holi/core/screens/userprofile/queries'
import { Paged } from '@holi/core/types'

export type NumberOfItems = {
  numberOfItems: number
}

// TODO: add "post", "postComment", "space" into options
export const notificationsQuery = gql`
  ${userAvatarFragment}

  query Notifications($offset: Int, $limit: Int) {
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
          user {
            ...UserAvatar
          }
          postComment {
            id
            post {
              id
            }
          }
        }
      }
      totalResults
    }
  }
`

export type NotificationsResponse = {
  notifications: Paged<Notification>
}
