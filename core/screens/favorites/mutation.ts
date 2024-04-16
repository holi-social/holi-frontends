import { gql } from '@apollo/client/core'

export const favoriteMutation = gql`
  mutation Favorite($favoritableId: UUID!, $favoritableType: FavoritableType!) {
    favorite(favoritableId: $favoritableId, favoritableType: $favoritableType) {
      success
    }
  }
`

export interface FavoriteResponse {
  success: boolean
}

export const unfavoriteMutation = gql`
  mutation Unfavorite($favoritableId: UUID!, $favoritableType: FavoritableType!) {
    unfavorite(favoritableId: $favoritableId, favoritableType: $favoritableType) {
      success
    }
  }
`

export interface UnfavoriteResponse {
  success: boolean
}
