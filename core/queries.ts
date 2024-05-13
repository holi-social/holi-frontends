import { gql } from '@apollo/client'

import { Insight } from '@holi/core/screens/insights/types'
import { UserAvatarFragment } from '@holi/core/screens/userprofile/queries'
import { Paged } from '@holi/core/types'

// Report Content query
export enum ContentType {
  POST = 'POST',
  POST_COMMENT = 'POST_COMMENT',
  USER = 'USER',
  SPACE = 'SPACE',
  FEED_POST = 'FEED_POST',
}

export const ReportContentMutation = gql`
  mutation ReportContent($contentType: ContentType!, $description: String, $objectId: UUID!) {
    reportContent(contentType: $contentType, description: $description, objectId: $objectId) {
      success
    }
  }
`

export interface ReportContentResponse {
  success: boolean
}

// Block user query
export const BlockUserMutation = gql`
  mutation BlockUser($userId: UUID!) {
    blockUser(userId: $userId) {
      success
    }
  }
`

export interface BlockUserResponse {
  success: boolean
}

export const MemberSpacesFragment = gql`
  ${UserAvatarFragment}
  fragment MemberSpaces on SpacePaged {
    data {
      id
      title
      avatar
      avatarBlurhash
      avatarDefaultColor
      cover
      coverBlurhash
      name
      members {
        data {
          user {
            ...UserAvatar
          }
        }
        totalResults
      }
    }
    totalResults
  }
`

export interface InsightsByUserIdResponse {
  insightsByUserId: Paged<Insight>
}

export const insightsByUserIdQuery = gql`
  query InsightsByUserIdQuery($userId: UUID!) {
    insightsByUserId(id: $userId) {
      data {
        title
        headerImage
        id
        posts {
          id
          image {
            id
            url
            width
            blurhash
          }
          title
        }
      }
      totalResults
    }
  }
`

export const insightsByUserIdTotalResultsQuery = gql`
  query InsightsByUserIdQueryTotalResults($userId: UUID!) {
    insightsByUserId(id: $userId) {
      totalResults
    }
  }
`
