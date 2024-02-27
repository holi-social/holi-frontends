import { gql } from '@apollo/client/core'

export const bookmarkInsightMutation = gql`
  mutation BookmarkInsight($insightId: UUID!) {
    bookmarkInsight(insightId: $insightId) {
      success
    }
  }
`

export const removeInsightBookmarkMutation = gql`
  mutation RemoveInsightBookmark($insightId: UUID!) {
    removeInsightBookmark(insightId: $insightId) {
      success
    }
  }
`

export interface BookmarkInsightResponse {
  success: boolean
}

export interface RemoveInsightBookmark {
  success: boolean
}
