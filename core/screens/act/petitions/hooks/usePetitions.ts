import { useMemo } from 'react'
import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import type { SearchParams } from '@holi/core/typesense/types'
import { useUserSpecificRecoParameters } from '@holi-apps/volunteering/hooks/useUserSpecificRecoParameters'
import type { Petition } from '@holi/core/screens/act/petitions/PetitionCard'

export const PETITION_PAGE_SIZE = 10

interface UsePetitionsProps {
  pageSize?: number
  displayErrors?: boolean
}

interface UsePetitionParametersOptions {
  pageSize?: number
}

interface UsePetitionParameters {
  isLoadingParameters: boolean
  parameters: SearchParams
}

export const usePetitionParameters = ({ pageSize }: UsePetitionParametersOptions = {}): UsePetitionParameters => {
  const { loading: loadingQueryVariables = false } = useUserSpecificRecoParameters()
  const parameters = useMemo(() => {
    return {
      filter_by: 'type:=[petition]',
      per_page: pageSize,
    }
  }, [pageSize])

  return {
    isLoadingParameters: loadingQueryVariables,
    parameters,
  }
}

export const usePetitions = ({ pageSize, displayErrors }: UsePetitionsProps = {}) => {
  const { displayError } = useErrorHandling()
  const language = useUserLanguage()
  const errorHandler = displayErrors ? displayError : logError

  const { isLoadingParameters, parameters } = usePetitionParameters({
    pageSize: pageSize ?? PETITION_PAGE_SIZE,
  })

  const { state, isLoading, fetchNextPage, refetch } = useTypesensePaginationQuery({
    parameters,
    skip: isLoadingParameters,
    onError: (error) => {
      errorHandler(error, 'Error retrieving recommendations', {
        location: 'usePetitions.useTypesensePaginationQuery',
      })
    },
  })

  const petitions = useMemo(
    () => state.hits.map((hit) => localizeTypesenseDocument(hit.document, language)),
    [language, state.hits]
  )

  useOnRefresh(refetch)

  return {
    isLoading: isLoadingParameters || (isLoading && !petitions.length),
    petitions: petitions as Petition[],
    canFetchMore: state.canFetchMore,
    fetchNextPage,
    totalResults: state.totalResults,
  }
}
