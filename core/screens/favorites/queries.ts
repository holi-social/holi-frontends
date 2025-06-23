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
                description
                datePublished
                initiatives {
                    link
                    __typename
                }
                creator {
                    fullName
                    avatar
                    __typename
                }
                headerImage
                headerImageBlurhash
                __typename
            }
            ... on ExternalVolunteeringOpportunity {
                externalId
                __typename
            }
            ... on Task {
                id
                name
                thumbnail
                thumbnailBlurhash
                created
                space {
                    creator {
                        fullName
                        avatar
                        avatarBlurhash
                    }
                }
                __typename
            }
        }
      }
      totalResults
    }
  }
`
