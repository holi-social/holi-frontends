import { useQuery } from '@apollo/client'
import { useMemo } from 'react'
import { useVolunteeringRecosQueryVariables } from '@holi-apps/volunteering/hooks/useVolunteeringRecosQueryVariables'
import { volunteeringRecosQuery } from '@holi-apps/volunteering/queries'
import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'
import { transformEngagementToTypesenseDocument } from '@holi-apps/volunteering/helpers/transformEngagementToTypesenseDocument'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import type { VolunteeringReco } from '@holi-apps/volunteering/types'

interface UseVolunteeringRecosLegacy {
  pageSize?: number
  skip?: boolean
}

export const useVolunteeringRecosLegacy = ({ pageSize, skip }: UseVolunteeringRecosLegacy) => {
  const { queryVariables, loading: loadingQueryVariables } = useVolunteeringRecosQueryVariables()
  const language = useUserLanguage()

  const { data, loading, refetch } = useQuery(volunteeringRecosQuery, {
    variables: {
      ...queryVariables,
      offset: 0,
      limit: pageSize,
    },
    skip: loadingQueryVariables || skip,
    onError: (error) =>
      logError(error, 'Failed to load volunteering recommendations', {
        location: 'useVolunteeringRecosLegacy.volunteeringRecosQuery',
      }),
  })

  useOnRefresh(async () => {
    if (!skip) {
      return refetch()
    }
  })

  const engagements = useMemo(() => {
    return (
      data?.appVolunteering_engagementRecosV2?.data.map((engagement: VolunteeringReco) =>
        localizeTypesenseDocument(transformEngagementToTypesenseDocument(engagement), language)
      ) || []
    )
  }, [data?.appVolunteering_engagementRecosV2?.data, language])

  return {
    isLoading: loading || loadingQueryVariables,
    engagements,
  }
}
