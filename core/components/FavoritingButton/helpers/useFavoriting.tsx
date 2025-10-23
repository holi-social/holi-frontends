import { type FavoritableType, useFavoriteV2Mutation, useUnfavoriteV2Mutation } from '@holi/api/graphql/graphql-codegen'
import { useCallback } from 'react'
import type { ApolloCache } from '@apollo/client'

import { ApolloError } from '@apollo/client/v4-migration'

export interface FavoritingMutationOptions {
  __typename: string
  onError?: (error: ApolloError) => void
  onCompleted?: () => void
  onUpdate?: (cache: ApolloCache<unknown>) => void
}

export const useFavoriting = (
  favoritableId: string,
  favoritableType: FavoritableType,
  { __typename, onError, onCompleted, onUpdate }: FavoritingMutationOptions
) => {
  const [favoriteMutation, { loading: isFavoriting }] = useFavoriteV2Mutation({
    variables: { favoritableId, favoritableType },
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
    variables: { favoritableId, favoritableType },
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
    const response = await favoriteMutation()
    return response.data?.favoriteV2.success ?? false
  }, [favoriteMutation])

  const unfavorite = useCallback(async (): Promise<boolean> => {
    const response = await unfavoriteMutation()
    return response.data?.unfavoriteV2.success ?? false
  }, [unfavoriteMutation])

  return {
    favorite,
    unfavorite,
    isFavoriting,
    isUnfavoriting,
  }
}
