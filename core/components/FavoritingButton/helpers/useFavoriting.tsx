import { type FavoritableType, useFavoriteV2Mutation, useUnfavoriteV2Mutation } from '@holi/api/graphql/graphql-codegen'
import { useCallback } from 'react'
import type { ApolloCache, ErrorLike } from '@apollo/client'

export interface FavoritingMutationOptions {
  __typename: string
  onError?: (error: ErrorLike) => void
  onCompleted?: () => void
  onUpdate?: (cache: ApolloCache) => void
}

export const useFavoriting = (
  favoritableId: string,
  favoritableType: FavoritableType,
  { __typename, onError, onCompleted, onUpdate }: FavoritingMutationOptions
) => {
  const [favoriteMutation, { loading: isFavoriting }] = useFavoriteV2Mutation({
    onError,
    onCompleted,
    update: (cache) => {
      cache.modify({
        id: cache.identify({ __typename, id: favoritableId }),
        fields: {
          isFavorite() {
            return true
          },
        },
      })
      onUpdate?.(cache)
    },
  })

  const [unfavoriteMutation, { loading: isUnfavoriting }] = useUnfavoriteV2Mutation({
    onError,
    onCompleted,
    update: (cache) => {
      cache.modify({
        id: cache.identify({ __typename, id: favoritableId }),
        fields: {
          isFavorite() {
            return false
          },
        },
      })
      onUpdate?.(cache)
    },
  })

  const favorite = useCallback(async (): Promise<boolean> => {
    const response = await favoriteMutation({
      variables: { favoritableId, favoritableType },
    })
    return response.data?.favoriteV2.success ?? false
  }, [favoriteMutation, favoritableId, favoritableType])

  const unfavorite = useCallback(async (): Promise<boolean> => {
    const response = await unfavoriteMutation({
      variables: { favoritableId, favoritableType },
    })
    return response.data?.unfavoriteV2.success ?? false
  }, [unfavoriteMutation, favoritableId, favoritableType])

  return {
    favorite,
    unfavorite,
    isFavoriting,
    isUnfavoriting,
  }
}
