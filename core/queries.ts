import { gql } from '@apollo/client'

import { UserAvatarFragment } from '@holi/core/domain/shared/queries'
import { Insight } from '@holi/core/screens/insights/types'
import { Paged } from '@holi/core/types'

// Report Content query
export enum ContentType {
  POST = 'POST',
  POST_COMMENT = 'POST_COMMENT',
  USER = 'USER',
  SPACE = 'SPACE',
  FEED_POST = 'FEED_POST',
  SPACE_TASK = 'SPACE_TASK',
  SPACE_APPOINTMENT = 'SPACE_APPOINTMENT',
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

export const translateQuery = gql`
  query Translate($text: String!, $targetLanguage: String!) {
    translatedText: translation_translate(text: $text, targetLanguage: $targetLanguage)
  }
`

export type TranslateQueryRespone = {
  translatedText: string
}

export const detectLanguageQuery = gql`
  query DetectLanguage($text: String!) {
    detectedLanguage: translation_detectLanguage(text: $text)
  }
`

export type DetectLanguageQueryResponse = {
  detectedLanguage: string
}
