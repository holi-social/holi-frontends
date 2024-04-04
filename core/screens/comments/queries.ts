import { gql } from '@apollo/client/core'

import { Comment } from '@holi/core/screens/comments/types'
import { UserAvatarFragment } from '@holi/core/screens/userprofile/queries'
import type { User } from '@holi/core/screens/userprofile/types'
import type { Paged } from '@holi/core/types'

export const commentsMetadata = gql`
  ${UserAvatarFragment}

  query CommentsMetadata($commentableId: UUID!, $commentableType: CommentableType!) {
    commentable(id: $commentableId, type: $commentableType) {
      topComment {
        text
        creator {
          ...UserAvatar
        }
      }
      commenters(limit: 5) {
        totalResults
        data {
          ...UserAvatar
        }
      }
    }
  }
`

export type CommentsMetadataResponse = {
  topComment?: Comment
  commenters: Paged<User>
}
