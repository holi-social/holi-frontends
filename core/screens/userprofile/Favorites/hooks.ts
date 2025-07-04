import {
  type FavoriteInsightFragment,
  type FavoriteTaskFragment,
  useFavoritesQuery,
  useTypesense_MultiSearchQuery,
} from '@holi/api/graphql/graphql-codegen'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'

export const useFavoritesTypesenseDocuments = (favoriteVolunteeringOpportunityIds: string[]) => {
  const language = useUserLanguage()

  const {
    data: { typesense_multiSearch } = {},
  } = useTypesense_MultiSearchQuery({
    variables: {
      input: {
        searches: [
          {
            q: '*',
            filter_by: `type:=[volunteering] && id:=[${favoriteVolunteeringOpportunityIds.join(', ')}]`,
            limit: 100,
          },
        ],
      },
    },
    skip: favoriteVolunteeringOpportunityIds.length === 0,
  })

  return (
    typesense_multiSearch?.results.reduce((acc: LocalizedTypesenseDocument[], result) => {
      if (result.__typename === 'Typesense_SearchResponseSuccess') {
        const hits = result.hits ?? []
        acc.push(...(hits.map(({ document }) => localizeTypesenseDocument(document, language)) ?? []))
      }
      return acc
    }, []) ?? []
  )
}

export type FavoriteItem = FavoriteInsightFragment | FavoriteTaskFragment | LocalizedTypesenseDocument

export const toTypesenseId = (id: string) => {
  return id.startsWith('volunteering_') ? id : 'volunteering_' + id
}

export const fromTypesenseId = (id: string) => {
  return id.startsWith('volunteering_') ? id.split('_')[1] : id
}

export const useFavorites = (): FavoriteItem[] => {
  const { displayError } = useErrorHandling()

  const {
    data: {
      favorites: { data: favorites = [] } = {},
    } = {},
  } = useFavoritesQuery({
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    onError: (error) => {
      displayError(error, 'Failed to load favorites', {
        location: 'Favorites.favoritesQuery',
      })
    },
    variables: {
      offset: 0,
      limit: 100, // limit it 100 for first iteration
    },
  })
  const favoriteVolunteeringOpportunityIds = favorites.reduce((acc: string[], { favoritable }) => {
    if (favoritable.__typename === 'ExternalVolunteeringOpportunity') {
      acc.push(toTypesenseId(favoritable.externalId))
    }
    return acc
  }, [])

  const typesenseDocuments = useFavoritesTypesenseDocuments(favoriteVolunteeringOpportunityIds)

  return favorites.reduce((acc: FavoriteItem[], { favoritable }) => {
    if (favoritable.__typename === 'ExternalVolunteeringOpportunity') {
      const typesenseDoc = typesenseDocuments.find((document) => document.id === toTypesenseId(favoritable.externalId))

      if (typesenseDoc) {
        acc.push(typesenseDoc)
      }
    } else {
      acc.push(favoritable)
    }
    return acc
  }, [])
}
