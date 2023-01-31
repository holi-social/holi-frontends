import { gql } from '@apollo/client'

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
