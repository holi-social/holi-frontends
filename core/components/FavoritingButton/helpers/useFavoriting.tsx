import { type FavoritableType, useFavoriteV2Mutation, useUnfavoriteV2Mutation } from '@holi/api/graphql/graphql-codegen'
import { useCallback } from 'react'
import type { ApolloError } from '@apollo/client'

interface MutationOptions {
  __typename: string
  onError?: (error: ApolloError) => void
  onCompleted?: () => void
}

export const useFavoriting = (
  favoritableId: string,
  favoritableType: FavoritableType,
  { __typename, onError, onCompleted }: MutationOptions
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
