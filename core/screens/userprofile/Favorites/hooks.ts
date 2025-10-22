import {
  type FavoriteInsightFragment,
  useFavoritesQuery,
  useTypesense_MultiSearchQuery,
} from '@holi/api/graphql/graphql-codegen'
import { isSSR } from '@holi/core/helpers/isSSR'
import { useApolloErrorDisplay } from '@holi/core/hooks/useApolloErrorDisplay'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { useEffect, useState } from 'react'

const useFavoritesTypesenseDocuments = (typesenseIds: string[]) => {
  const language = useUserLanguage()
  /**
   * use state on purpose to avoid showing a blank screen when a user unfavorites an item
   * and we refetch the typesense documents so, the data from the previous query fetch is not available.
   * This way we "caching" the data in the state till the new query fetch is completed.
   */
  const [documents, setDocuments] = useState<LocalizedTypesenseDocument[]>([])

  const { data, loading } = useTypesense_MultiSearchQuery({
    variables: {
      input: {
        searches: [
          {
            q: '*',
            filter_by: `type:=[volunteering, task] && id:=[${typesenseIds.join(', ')}]`,
            limit: 100,
          },
        ],
      },
    },
  })

  useEffect(() => {
    if (data) {
      const newDocuments =
        data.typesense_multiSearch?.results.reduce((acc: LocalizedTypesenseDocument[], result) => {
          if (result.__typename === 'Typesense_SearchResponseSuccess') {
            const hits = result.hits ?? []
            acc.push(...(hits.map(({ document }) => localizeTypesenseDocument(document, language)) ?? []))
          }
          return acc
        }, []) ?? []
      setDocuments(newDocuments)
    }
  }, [data, language])

  return { documents, loading }
}

export type FavoriteItem = FavoriteInsightFragment | (LocalizedTypesenseDocument & { favoriteId: string })

export const toTypesenseId = (id: string, type: string) => {
  return type === 'volunteering' ? 'volunteering_' + id : 'task_' + id
}

export const fromTypesenseId = (id: string) => {
  return id.split('_')[1]
}

export const useFavorites = (limit?: number) => {
  const {
    data: {
      favorites: { data: favorites = [], totalResults = 0 } = {},
    } = {},
    loading: favoritesLoading,
    refetch,
    error,
  } = useFavoritesQuery({
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    variables: {
      offset: 0,
      limit: limit || 100, // limit it 100 for first iteration
    },
  })
  useApolloErrorDisplay(error, 'Failed to load favorites', {
    location: 'Favorites.favoritesQuery',
  })

  const favoriteTypesenseIds = favorites.reduce((acc: string[], { favoritable }) => {
    if (favoritable.__typename === 'ExternalVolunteeringOpportunity') {
      acc.push(toTypesenseId(favoritable.externalId, 'volunteering'))
    } else if (favoritable.__typename === 'Task') {
      acc.push(toTypesenseId(favoritable.id, 'task'))
    }
    return acc
  }, [])

  const { documents: typesenseDocuments, loading: typesenseDocumentsLoading } =
    useFavoritesTypesenseDocuments(favoriteTypesenseIds)

  const favoriteItems = favorites.reduce((acc: FavoriteItem[], { favoritable, id }) => {
    switch (favoritable.__typename) {
      case 'Insight':
        acc.push(favoritable)
        break
      case 'ExternalVolunteeringOpportunity': {
        const typesenseDoc = typesenseDocuments.find(
          (document) => document.id === toTypesenseId(favoritable.externalId, 'volunteering')
        )
        if (typesenseDoc) acc.push({ ...typesenseDoc, favoriteId: id })
        break
      }
      case 'Task': {
        const typesenseDoc = typesenseDocuments.find(
          (document) => document.id === toTypesenseId(favoritable.id, 'task')
        )
        if (typesenseDoc) acc.push({ ...typesenseDoc, favoriteId: id })
        break
      }
      default:
        break
    }

    return acc
  }, [])

  return {
    favoriteItems,
    totalResults,
    refetch,
    loading: favoritesLoading || typesenseDocumentsLoading,
    error,
  }
}
