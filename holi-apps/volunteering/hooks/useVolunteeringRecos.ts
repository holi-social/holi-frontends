import { useMemo } from 'react'
import { ENGAGEMENT_PAGE_SIZE } from '@holi-apps/volunteering/components/VolunteeringEngagementList'
import { useVolunteeringRecoParameters } from '@holi-apps/volunteering/hooks/useVolunteeringRecoParameters'
import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'

interface UseVolunteeringRecosProps {
  pageSize?: number
  displayErrors?: boolean
}

export const useVolunteeringRecos = ({ pageSize, displayErrors }: UseVolunteeringRecosProps = {}) => {
  const { displayError } = useErrorHandling()
  const language = useUserLanguage()
  const errorHandler = displayErrors ? displayError : logError

  const { isLoadingParameters, parameters } = useVolunteeringRecoParameters({
    pageSize: pageSize ?? ENGAGEMENT_PAGE_SIZE,
    onGeolocationError: (error) => {
      errorHandler(error, 'Error retrieving geolocation', {
        location: 'useVolunteeringRecos.useVolunteeringRecoParameters',
      })
    },
  })

  const { state, isLoading, fetchNextPage, refetch } = useTypesensePaginationQuery({
    parameters,
    skip: isLoadingParameters,
    onError: (error) => {
      errorHandler(error, 'Error retrieving recommendations', {
        location: 'useVolunteeringRecos.useTypesensePaginationQuery',
      })
    },
  })

  const engagements = useMemo(
    () => state.hits.map((hit) => localizeTypesenseDocument(hit.document, language)),
    [language, state.hits]
  )

  useOnRefresh(refetch)

  return {
    isLoading: isLoading || isLoadingParameters,
    engagements,
    canFetchMore: state.canFetchMore,
    fetchNextPage,
  }
}
