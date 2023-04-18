import { gql } from '@apollo/client'

import { Insight } from '@holi/core/screens/insights/types'
import { Paged } from '@holi/core/types'

// Report Content query
export enum ContentType {
  POST = 'POST',
  POST_COMMENT = 'POST_COMMENT',
  USER = 'USER',
  SPACE = 'SPACE',
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

export const memberSpacesFragment = gql`
  fragment MemberSpaces on SpacePaged {
    data {
      id
      title
      cover
      name
      members {
        id
        data {
          user {
            id
            avatar
            avatarLabel
            avatarDefaultColor
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
          }
          title
        }
      }
      totalResults
    }
  }
`
