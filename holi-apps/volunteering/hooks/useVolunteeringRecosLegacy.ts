import { useQuery } from '@apollo/client'
import { useMemo } from 'react'
import { useVolunteeringRecosQueryVariables } from '@holi-apps/volunteering/hooks/useVolunteeringRecosQueryVariables'
import { volunteeringRecosQuery } from '@holi-apps/volunteering/queries'
import { logError } from '@holi/core/errors/helpers'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'

interface UseVolunteeringRecosLegacy {
  pageSize?: number
  skip?: boolean
}

export const useVolunteeringRecosLegacy = ({ pageSize, skip }: UseVolunteeringRecosLegacy) => {
  const { queryVariables, loading: loadingQueryVariables } = useVolunteeringRecosQueryVariables()

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
    return data?.appVolunteering_engagementRecosV2?.data || []
  }, [data?.appVolunteering_engagementRecosV2?.data])

  return {
    isLoading: loading || loadingQueryVariables,
    engagements,
  }
}
