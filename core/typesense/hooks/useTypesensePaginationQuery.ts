import {
  type TypesensePaginationState,
  useTypesensePaginationMultiQuery,
  type UseTypesensePaginationMultiQueryHook,
  type UseTypesensePaginationMultiQueryOptions,
} from '@holi/core/typesense/hooks/useTypesensePaginationMultiQuery'
import type { SearchParams } from '@holi/core/typesense/types'

export type UseTypesensePaginationQueryOptions = Omit<UseTypesensePaginationMultiQueryOptions, 'parameterList'> & {
  parameters: SearchParams
}

export type UseTypesensePaginationQueryHook = Omit<
  UseTypesensePaginationMultiQueryHook,
  'states' | 'fetchNextPages'
> & {
  state: TypesensePaginationState
  fetchNextPage: () => Promise<void>
}

export const useTypesensePaginationQuery = ({
  parameters,
  onError,
  skip,
}: UseTypesensePaginationQueryOptions): UseTypesensePaginationQueryHook => {
  const { states, isLoading, isFetchingMore, fetchNextPages, refetch } = useTypesensePaginationMultiQuery({
    parameterList: [parameters],
    onError,
    skip,
  })

  return {
    isLoading,
    state: states[0],
    isFetchingMore,
    fetchNextPage: fetchNextPages,
    refetch,
  }
}
