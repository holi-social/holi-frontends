import { gql } from '@apollo/client/core'

// todo gregor: remove legacy mutations after V2 adaption
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

// todo gregor: remove legacy mutations after V2 adaption
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

export const favoriteV2Mutation = gql`
  mutation FavoriteV2($favoritableId: String!, $favoritableType: FavoritableType!) {
    favoriteV2(favoritableId: $favoritableId, favoritableType: $favoritableType) {
      success
    }
  }
`

export interface FavoriteV2Response {
  success: boolean
}

export const unfavoriteV2Mutation = gql`
  mutation UnfavoriteV2($favoritableId: String!, $favoritableType: FavoritableType!) {
    unfavoriteV2(favoritableId: $favoritableId, favoritableType: $favoritableType) {
      success
    }
  }
`

export interface UnfavoriteV2Response {
  success: boolean
}
