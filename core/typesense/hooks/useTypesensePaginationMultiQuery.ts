import { useQuery } from '@apollo/client'
import {
  Typesense_MultiSearchDocument,
  type Typesense_SearchResponseSuccess,
  type Typesense_SearchResponseError,
  type Typesense_SearchResponseFacetCounts,
} from '@holi/api/graphql/graphql-codegen'
import { logError } from '@holi/core/errors/helpers'
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

          // TEST: Force output to verify this code is executing
          if (typeof process !== 'undefined' && process.stdout) {
            process.stdout.write(`🧪 TYPESENSE HOOK EXECUTING: q="${parameters.q}" nl_query=${parameters.nl_query}\n`)
          }

          // Enhanced debug logging when nl_query_debug is enabled
          if (parameters.nl_query_debug) {
            const timestamp = new Date().toISOString()
            
            // Force output to terminal using process.stdout
            if (typeof process !== 'undefined' && process.stdout) {
              process.stdout.write(`\n🔍 TYPESENSE NLP DEBUG START [${timestamp}] 🔍\n`)
              process.stdout.write(`Search Query (q): ${parameters.q}\n`)
              process.stdout.write(`NL Query: ${parameters.nl_query}\n`)
              process.stdout.write(`NL Model ID: ${parameters.nl_model_id}\n`)
              process.stdout.write(`NL Debug: ${parameters.nl_query_debug}\n`)
              process.stdout.write(`Results type: ${results.__typename}\n`)
              process.stdout.write(`Found results: ${results.found}\n`)
              process.stdout.write(`Has conversation: ${!!results.conversation}\n`)
              
              if (results.conversation) {
                process.stdout.write(`🤖 NLP Location Extraction Debug\n`)
                process.stdout.write(`Original Query: ${results.conversation.query}\n`)
                process.stdout.write(`LLM Answer: ${results.conversation.answer}\n`)
                process.stdout.write(`Conversation ID: ${results.conversation.conversation_id}\n`)
                
                if (results.conversation.conversation_history?.conversation?.length > 0) {
                  process.stdout.write(`Conversation History (LLM Processing):\n`)
                  results.conversation.conversation_history.conversation.forEach((entry, index) => {
                    process.stdout.write(`  Entry ${index + 1}: ${JSON.stringify(entry)}\n`)
                  })
                } else {
                  process.stdout.write(`⚠️ Conversation exists but no conversation history found\n`)
                }
              } else {
                process.stdout.write(`❌ No conversation data in response\n`)
                process.stdout.write(`This could mean:\n`)
                process.stdout.write(`  - Query was too simple for NLP processing\n`)
                process.stdout.write(`  - Backend NLP is disabled or failed\n`)
                process.stdout.write(`  - No location extraction was needed\n`)
                process.stdout.write(`Available fields in results: ${Object.keys(results).join(', ')}\n`)
                
                // Check if there are any request_params that might have debug info
                if (results.request_params) {
                  process.stdout.write(`Request params: ${JSON.stringify(results.request_params)}\n`)
                }
              }
              
              process.stdout.write(`🔍 TYPESENSE NLP DEBUG END [${timestamp}] 🔍\n\n`)
            }
            
            // Also use regular console.log as backup
            console.log(`\n🔍 TYPESENSE NLP DEBUG START [${timestamp}] 🔍`)
            console.log('Search Query (q):', parameters.q)
            console.log('Search Parameters:', JSON.stringify({
              q: parameters.q,
              nl_query: parameters.nl_query,
              nl_model_id: parameters.nl_model_id,
              nl_query_debug: parameters.nl_query_debug,
              filter_by: parameters.filter_by,
              query_by: parameters.query_by
            }, null, 2))
            console.log('Results type:', results.__typename)
            console.log('Found results:', results.found)
            console.log('Has conversation:', !!results.conversation)
            
            if (results.conversation) {
              console.log('🤖 NLP Location Extraction Debug')
              console.log('Original Query:', results.conversation.query)
              console.log('LLM Answer:', results.conversation.answer)
              console.log('Conversation ID:', results.conversation.conversation_id)
              
              if (results.conversation.conversation_history?.conversation?.length > 0) {
                console.log('Conversation History (LLM Processing):')
                results.conversation.conversation_history.conversation.forEach((entry, index) => {
                  console.log(`  Entry ${index + 1}:`, JSON.stringify(entry, null, 2))
                })
              } else {
                console.log('⚠️ Conversation exists but no conversation history found')
              }
            } else {
              console.log('❌ No conversation data in response')
              console.log('This could mean:')
              console.log('  - Query was too simple for NLP processing')
              console.log('  - Backend NLP is disabled or failed')
              console.log('  - No location extraction was needed')
              console.log('Available fields in results:', Object.keys(results))
              
              // Check if there are any request_params that might have debug info
              if (results.request_params) {
                console.log('Request params:', JSON.stringify(results.request_params, null, 2))
              }
            }
            
            console.log(`🔍 TYPESENSE NLP DEBUG END [${timestamp}] 🔍\n`)
          }

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
      .catch((error) =>
        logError(error, 'Failed to fetch more', {
          location: 'useTypesensePaginationMultiQuery.fetchNextPages',
        })
      )
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
    // Only logging first error if there are multiple ones
    if (stateWithError && 'error' in stateWithError) {
      if (onError) {
        onError(stateWithError.error)
      } else {
        logError(stateWithError.error, 'Failed to fetch documents', {
          location: 'useTypesensePaginationMultiQuery',
        })
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
