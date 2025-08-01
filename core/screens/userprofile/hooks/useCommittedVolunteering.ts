import {
  useCommittedVolunteeringOpportunitiesQuery,
  type VolunteeringOpportunityStatusValue,
  type CommittedVolunteeringOpportunitiesQuery,
} from '@holi/api/graphql/graphql-codegen'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import { useTypesenseEnrichedData } from '@holi/core/typesense/hooks/useTypesenseEnrichedData'
import { useEffect } from 'react'

export type NormalizedCommittedVolunteeringItem = {
  id: string
  title: string
  organizerName: string
  imageUrl: string
  location?: string
  locationType?: string
  status: VolunteeringOpportunityStatusValue
  externalVolunteeringOpportunityId: string
}

export const toVolunteeringTypesenseId = (externalId: string) => {
  return 'volunteering_' + externalId
}

interface VolunteeringPaginationState {
  items: NormalizedCommittedVolunteeringItem[]
  totalResults: number
  canFetchMore: boolean
  isLoading: boolean
  isInitialLoad: boolean
  isFetchingMore: boolean
  refetch(): Promise<void>
}

export const useCommittedVolunteering = (
  limit = 10
): VolunteeringPaginationState & {
  fetchMore: () => Promise<void>
  refetch: () => Promise<void>
} => {
  const { displayError } = useErrorHandling()

  const opportunitiesIds = useCommittedVolunteeringOpportunitiesQuery({
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network',
    variables: {
      offset: 0,
      limit,
    },
  })

  useEffect(() => {
    if (opportunitiesIds.error) {
      displayError(opportunitiesIds.error, 'Failed to load committed volunteering opportunities', {
        location: 'useCommittedVolunteering.committedVolunteeringOpportunitiesQuery',
      })
    }
  }, [opportunitiesIds.error, displayError])

  type GraphQLItem = NonNullable<
    CommittedVolunteeringOpportunitiesQuery['committedVolunteeringOpportunities']
  >['data'][0]

  const committedVolunteeringOpportunities = opportunitiesIds.data?.committedVolunteeringOpportunities || {
    data: [],
    totalResults: 0,
  }

  const {
    items: opportunitiesData,
    totalResults,
    isLoading,
    isFetchingMore,
    hasMore,
    fetchMore: fetchMoreUtil,
    refetch: refetchUtil,
  } = useTypesenseEnrichedData<GraphQLItem, NormalizedCommittedVolunteeringItem>({
    graphqlData: {
      data: committedVolunteeringOpportunities.data,
      totalResults: committedVolunteeringOpportunities.totalResults,
      loading: opportunitiesIds.loading,
      error: opportunitiesIds.error,
      fetchMore: opportunitiesIds.fetchMore,
      refetch: opportunitiesIds.refetch,
    },
    typesenseIdExtractor: (item) => toVolunteeringTypesenseId(item.externalVolunteeringOpportunityId),
    typesenseFilter: 'type:=[volunteering]',
    limit,
    itemNormalizer: (graphqlItem, volunteering) => ({
      id: toVolunteeringTypesenseId(graphqlItem.externalVolunteeringOpportunityId),
      title: volunteering.title,
      organizerName: volunteering.organizer_name as string,
      imageUrl: volunteering.image_url || '',
      location: volunteering.location || '',
      locationType: volunteering.location_type || '',
      status: graphqlItem.status,
      externalVolunteeringOpportunityId: graphqlItem.externalVolunteeringOpportunityId,
    }),
  })

  const isInitialLoad = opportunitiesData.length === 0 && isLoading

  const fetchMore = async () => {
    try {
      await fetchMoreUtil()
    } catch (error) {
      displayError(error as Error, 'Failed to load your volunteering opportunities', {
        location: 'useCommittedVolunteering.fetchMore',
      })
    }
  }

  const refetch = async () => {
    try {
      await refetchUtil()
    } catch (error) {
      displayError(error as Error, 'Failed to refetch volunteering opportunities', {
        location: 'useCommittedVolunteering.refetch',
      })
    }
  }

  return {
    items: opportunitiesData,
    totalResults,
    canFetchMore: hasMore,
    isLoading,
    isInitialLoad,
    isFetchingMore,
    fetchMore,
    refetch,
  }
}
