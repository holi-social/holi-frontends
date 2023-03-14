import { gql } from '@apollo/client'

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
        data {
          user {
            id
            avatar
            avatarLabel
            avatarDefaultColor
          }
        }
      }
    }
    totalResults
  }
`
