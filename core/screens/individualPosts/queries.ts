import { gql } from '@apollo/client/core'

import { Category } from '@holi/core/screens/individualPosts/types'
import { Paged } from '@holi/core/types'

export const feedPostCategoriesQuery = gql`
  query FeedPostCategories {
    feedPostCategories {
      data {
        id
        title
        slug
      }
    }
  }
`

export interface FeedPostCategoriesQueryResult {
  feedPostCategories: Paged<Category>
}
