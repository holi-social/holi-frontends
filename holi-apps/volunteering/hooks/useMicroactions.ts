import { useMemo } from 'react'
import { useMicroactionParameters } from '@holi-apps/volunteering/hooks/useMicroactionParameters'
import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import type { PlaceDetails } from '@holi/core/geolocation/typings'

interface UseMicroactionProps {
  userLocation?: PlaceDetails
  skip?: boolean
}

export const MICROACTION_PAGE_SIZE = 5

export const useMicroactions = ({ userLocation, skip = false }: UseMicroactionProps = {}) => {
  const language = useUserLanguage()

  const { parameters } = useMicroactionParameters(MICROACTION_PAGE_SIZE, userLocation)

  const { state, isLoading, fetchNextPage, refetch, isFetchingMore } = useTypesensePaginationQuery({
    parameters,
    skip,
    onError: (error) => {
      logError(error, 'Error retrieving recommendations', {
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
    isLoading: isLoading || isFetchingMore,
    engagements,
    canFetchMore: state.canFetchMore,
    fetchNextPage,
  }
}
