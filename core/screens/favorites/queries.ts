import { gql } from '@apollo/client/core'

import { UserAvatarFragment } from '@holi/core/screens/userprofile/queries'

export const favoritesQuery = gql`
  ${UserAvatarFragment}

  query Favorites($offset: Int! = 0, $limit: Int! = 10) {
    favorites(offset: $offset, limit: $limit) {
      data {
        id
        favoritableId
        favoritableType
        favoritable {
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
