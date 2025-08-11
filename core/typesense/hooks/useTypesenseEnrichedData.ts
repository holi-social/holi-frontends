import { useMemo, useState, useRef } from 'react'
import { useTypesense_MultiSearchQuery } from '@holi/api/graphql/graphql-codegen'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import type { QueryResult } from '@apollo/client'

export interface UseTypesenseEnrichedDataConfig<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TQueryResult extends QueryResult<any, any>,
  TGraphQLItem,
  TNormalizedItem,
> {
  graphqlQuery: TQueryResult
  dataExtractor: (data: TQueryResult['data']) => { data: TGraphQLItem[]; totalResults: number }
  typesenseIdExtractor: (item: TGraphQLItem) => string
  typesenseFilter: string
  itemNormalizer?: (graphqlItem: TGraphQLItem, typesenseDoc: LocalizedTypesenseDocument) => TNormalizedItem
  limit?: number
  skipMissingTypesenseData?: boolean
}

export interface UseTypesenseEnrichedDataResult<TGraphQLItem, TNormalizedItem> {
  items: TNormalizedItem extends undefined ? TGraphQLItem[] : TNormalizedItem[]
  totalResults: number
  isLoading: boolean
  isFetchingMore: boolean
  hasMore: boolean
  fetchMore: () => Promise<void>
  refetch: () => Promise<void>
  error?: Error
  rawGraphQLData: TGraphQLItem[]
}

export function useTypesenseEnrichedData<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TQueryResult extends QueryResult<any, any>,
  TGraphQLItem,
  TNormalizedItem = undefined,
>({
  graphqlQuery,
  dataExtractor,
  typesenseIdExtractor,
  typesenseFilter,
  itemNormalizer,
  limit = 10,
  skipMissingTypesenseData = true,
}: UseTypesenseEnrichedDataConfig<TQueryResult, TGraphQLItem, TNormalizedItem>): UseTypesenseEnrichedDataResult<
  TGraphQLItem,
  TNormalizedItem
> {
  const language = useUserLanguage()
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const { rawGraphQLData, totalResults } = useMemo(() => {
    if (!graphqlQuery.data) {
      return { rawGraphQLData: [] as TGraphQLItem[], totalResults: 0 }
    }
    const extracted = dataExtractor(graphqlQuery.data)
    return { rawGraphQLData: extracted.data, totalResults: extracted.totalResults }
  }, [graphqlQuery.data, dataExtractor])

  const typesenseIds = useMemo(() => rawGraphQLData.map(typesenseIdExtractor), [rawGraphQLData, typesenseIdExtractor])

  const { data: typesenseData, loading: typesenseLoading } = useTypesense_MultiSearchQuery({
    variables: {
      input: {
        searches: [
          {
            q: '*',
            filter_by: `${typesenseFilter} && id:=[${typesenseIds.join(', ')}]`,
            limit: typesenseIds.length || 100,
          },
        ],
      },
    },
    skip: typesenseIds.length === 0,
  })

  const typesenseDocuments = useMemo(() => {
    if (!typesenseData?.typesense_multiSearch?.results) return []

    return typesenseData.typesense_multiSearch.results.reduce((acc: LocalizedTypesenseDocument[], result) => {
      if (result.__typename === 'Typesense_SearchResponseSuccess') {
        let hits: NonNullable<typeof result.hits> = []

        if (result.grouped_hits && result.grouped_hits.length > 0) {
          hits = result.grouped_hits.reduce((acc: NonNullable<typeof result.hits>, group) => {
            if (group?.hits) {
              acc.push(...group.hits.filter((hit): hit is NonNullable<typeof hit> => hit !== null))
            }
            return acc
          }, [])
        } else {
          hits = result.hits ?? []
        }

        acc.push(...(hits.map(({ document }) => localizeTypesenseDocument(document, language)) ?? []))
      }
      return acc
    }, [])
  }, [typesenseData?.typesense_multiSearch?.results, language])

  // Ref is needed to avoid the data to reset while
  // fetching data from typesense
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemsRef = useRef<TNormalizedItem extends undefined ? TGraphQLItem[] : TNormalizedItem[]>([] as any)

  const processedItems = useMemo(() => {
    if (!itemNormalizer) {
      const filteredItems = rawGraphQLData.filter((graphqlItem) => {
        if (!skipMissingTypesenseData) return true
        const typesenseId = typesenseIdExtractor(graphqlItem)
        return typesenseDocuments.some((doc) => doc.id === typesenseId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any

      if (!typesenseLoading || filteredItems.length >= itemsRef.current.length) {
        itemsRef.current = filteredItems
      }

      return itemsRef.current
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const enrichedItems = rawGraphQLData.reduce((acc: any[], graphqlItem) => {
      const typesenseId = typesenseIdExtractor(graphqlItem)
      const typesenseDoc = typesenseDocuments.find((doc) => doc.id === typesenseId)

      if (!typesenseDoc && skipMissingTypesenseData) return acc
      if (typesenseDoc) acc.push(itemNormalizer(graphqlItem, typesenseDoc))
      return acc
    }, [])

    if (!typesenseLoading || enrichedItems.length >= itemsRef.current.length) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      itemsRef.current = enrichedItems as any
    }

    return itemsRef.current
  }, [
    rawGraphQLData,
    typesenseDocuments,
    typesenseIdExtractor,
    itemNormalizer,
    skipMissingTypesenseData,
    typesenseLoading,
  ])

  const hasMore = rawGraphQLData.length < totalResults

  const fetchMore = async () => {
    if (!hasMore || isFetchingMore || !graphqlQuery.fetchMore) return

    setIsFetchingMore(true)
    try {
      await graphqlQuery.fetchMore({
        variables: {
          offset: rawGraphQLData.length,
          limit,
        },
      })
    } finally {
      setIsFetchingMore(false)
    }
  }

  const refetch = async () => {
    await graphqlQuery.refetch?.()
  }

  return {
    items: processedItems,
    totalResults,
    isLoading: graphqlQuery.loading || typesenseLoading,
    isFetchingMore,
    hasMore,
    fetchMore,
    refetch,
    error: graphqlQuery.error,
    rawGraphQLData,
  }
}
