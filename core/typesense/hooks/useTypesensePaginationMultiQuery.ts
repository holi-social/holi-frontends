import { useQuery } from '@apollo/client'
import {
  Typesense_MultiSearchDocument,
  type Typesense_SearchResponseSuccess,
  type Typesense_SearchResponseError,
  type Typesense_SearchResponseFacetCounts,
} from '@holi/api/graphql/graphql-codegen'
import type { SearchParams, SearchResponseHit, TypesenseFacetCounts } from '@holi/core/typesense/types'
import { useCallback, useEffect, useMemo, useState } from 'react'

const INITIAL_PAGE = 1
const DEFAULT_PAGE_SIZE = 10

export interface UseTypesensePaginationMultiQueryOptions {
  parameterList: SearchParams[]
  onError?: (error: Error) => void
  skip?: boolean
}

export interface TypesensePaginationState {
  hits: SearchResponseHit[]
  totalNrOfPages: number
  totalResults: number
  canFetchMore: boolean
  currentPage: number
  parameters: SearchParams
  error?: Error
  facetCounts: TypesenseFacetCounts
}

export interface UseTypesensePaginationMultiQueryHook {
  isLoading: boolean
  isFetchingMore: boolean
  states: TypesensePaginationState[]
  fetchNextPages: () => Promise<void>
  refetch: () => Promise<void>
}

const emptyState: Omit<TypesensePaginationState, 'parameters'> = {
  hits: [],
  totalNrOfPages: 0,
  totalResults: 0,
  currentPage: 0,
  canFetchMore: false,
  facetCounts: {},
}

const transformFacetCounts = (facetCounts?: Typesense_SearchResponseFacetCounts[]) =>
  Object.fromEntries(
    facetCounts?.map(({ counts, field_name }) => {
      const count_entries = counts.map(({ count, value }) => [value, count])
      return [field_name, Object.fromEntries(count_entries)]
    }) ?? []
  )

export const useTypesensePaginationMultiQuery = ({
  parameterList,
  onError,
  skip,
}: UseTypesensePaginationMultiQueryOptions): UseTypesensePaginationMultiQueryHook => {
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [hasTriedGptFallback, setHasTriedGptFallback] = useState(false)
  const searches = useMemo(
    () =>
      parameterList.map((parameters) => ({
        q: '*',
        per_page: DEFAULT_PAGE_SIZE,
        exclude_fields: 'embedding,similarity_embedding,topics_skills_embedding_v2',
        ...parameters,
        page: INITIAL_PAGE,
      })),
    [parameterList]
  )
  const {
    loading: isLoading,
    data,
    refetch: refetchResults,
    fetchMore,
    error,
  } = useQuery(Typesense_MultiSearchDocument, {
    variables: {
      input: {
        searches,
      },
    },
    skip,
  })

  // Full result in one state to control rerenderings
  const states = useMemo(() => {
    const resultList: (Typesense_SearchResponseSuccess | Typesense_SearchResponseError)[] =
      data?.typesense_multiSearch?.results
    if (!resultList?.length) {
      return parameterList.map((parameters) => ({
        ...emptyState,
        error: isLoading || skip ? undefined : (error ?? new Error('Error fetching results')),
        parameters,
      }))
    } else {
      return resultList.map((results, index) => {
        const parameters = parameterList[index]
        if ('error' in results) {
          return {
            ...emptyState,
            error: new Error(results.error),
            parameters,
          }
        } else {
          const pageSize = parameters.per_page ?? DEFAULT_PAGE_SIZE
          const totalNrOfPages = Math.ceil(results.found / pageSize)
          const canFetchMore = results.found > pageSize * results.page

          return {
            hits: results.hits ?? [],
            totalResults: results.found,
            totalNrOfPages,
            currentPage: results.page,
            canFetchMore,
            parameters,
            facetCounts: transformFacetCounts(results.facet_counts),
          }
        }
      })
    }
  }, [data?.typesense_multiSearch?.results, isLoading, parameterList, skip, error])

  // Fallback: if NL search with gemini-model returns zero hits, retry once with gpt-model
  useEffect(() => {
    if (skip || isLoading || hasTriedGptFallback) return

    const resultList: (Typesense_SearchResponseSuccess | Typesense_SearchResponseError)[] | undefined =
      data?.typesense_multiSearch?.results
    if (!resultList?.length) return

    // Check if any search used NL with gemini-model and got zero hits
    const needsFallback = resultList.some((result, index) => {
      if ('error' in result) return false
      const params = searches[index]
      const isGeminiNl =
        Boolean(params?.nl_query) && (params as unknown as { nl_model_id?: string }).nl_model_id === 'gemini-model'
      const noHits = !result.found || result.found === 0
      return isGeminiNl && noHits
    })

    if (!needsFallback) return

    const fallbackSearches = searches.map((s) => {
      const isGeminiNl =
        Boolean(s?.nl_query) && (s as unknown as { nl_model_id?: string }).nl_model_id === 'gemini-model'
      if (!isGeminiNl) return s
      return { ...s, nl_model_id: 'gpt-model' } as SearchParams
    })

    setHasTriedGptFallback(true)
    refetchResults({
      input: {
        searches: fallbackSearches,
      },
    }).catch(() => undefined)
  }, [data?.typesense_multiSearch?.results, hasTriedGptFallback, isLoading, refetchResults, searches, skip])

  const fetchNextPages = useCallback(async () => {
    if (isFetchingMore) {
      return
    }
    setIsFetchingMore(true)
    await fetchMore({
      variables: {
        input: {
          searches: searches.map((search, index) => ({
            ...search,
            page: states[index].currentPage + 1,
          })),
        },
      },
    })
      .catch(() => undefined)
      .finally(() => setIsFetchingMore(false))
  }, [fetchMore, isFetchingMore, searches, states])

  const refetch = useCallback(async () => {
    if (skip) {
      return
    }
    await refetchResults({
      input: {
        searches: searches.map((parameters) => ({
          ...parameters,
          page: INITIAL_PAGE,
        })),
      },
    })
  }, [refetchResults, searches, skip])

  useEffect(() => {
    const stateWithError = states.find((state) => 'error' in state && state.error)
    if (stateWithError && 'error' in stateWithError) {
      if (onError) {
        onError(stateWithError.error)
      }
    }
  }, [onError, states])

  return {
    isLoading,
    states,
    isFetchingMore,
    fetchNextPages,
    refetch,
  }
}
