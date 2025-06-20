import { useMemo } from 'react'
import { ENGAGEMENT_PAGE_SIZE } from '@holi-apps/volunteering/components/VolunteeringEngagementList'
import { useMicroactionParameters } from '@holi-apps/volunteering/hooks/useMicroactionParamteres'
import { logError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import type { GeolocationSuggestion } from '@holi/core/geolocation/components/PlacesAutocomplete'

interface UseMicroactionProps {
  pageSize?: number
  displayErrors?: boolean
  userLocation?: GeolocationSuggestion
}

export const useMicroactions = ({ pageSize, displayErrors, userLocation }: UseMicroactionProps = {}) => {
  const { displayError } = useErrorHandling()
  const language = useUserLanguage()
  const errorHandler = displayErrors ? displayError : logError

  const { parameters } = useMicroactionParameters(pageSize ?? ENGAGEMENT_PAGE_SIZE, userLocation)

  const { state, fetchNextPage, refetch } = useTypesensePaginationQuery({
    parameters,
    onError: (error) => {
      errorHandler(error, 'Error retrieving recommendations', {
        location: 'useMicroactions.useTypesensePaginationQuery',
      })
    },
  })

  const engagements = useMemo(
    () => state.hits.map((hit) => localizeTypesenseDocument(hit.document, language)),
    [language, state.hits]
  )

  useOnRefresh(refetch)

  return {
    isLoading: state.isLoading,
    engagements,
    fetchNextPage,
  }
}
