import { gql } from '@apollo/client/core'

import { UserAvatarFragment } from '@holi/core/domain/shared/queries'

export const favoritesQuery = gql`
  ${UserAvatarFragment}

  query Favorites($offset: Int! = 0, $limit: Int! = 10) {
    favorites(offset: $offset, limit: $limit) {
      data {
        id
        favoritableId
        favoritableType
        favoritable {
          __typename
          ... on Insight {
            id
            title
            datePublished
            creator {
              ...UserAvatar
              aboutMe
            }
            headerImage
            headerImageBlurhash
          }
        }
      }
      totalResults
    }
  }
`
