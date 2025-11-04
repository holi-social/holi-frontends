import type { ErrorLike } from '@apollo/client'
import {
  useCommittedVolunteeringOpportunitiesQuery,
  type VolunteeringOpportunityStatusValue,
} from '@holi/api/graphql/graphql-codegen'
import { useErrorHandling } from '@holi/core/errors/hooks'
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
  error?: ErrorLike
}

export const useCommittedVolunteering = (
  limit = 10
): VolunteeringPaginationState & {
  fetchMore: () => Promise<void>
  refetch: () => Promise<void>
} => {
  const { displayError } = useErrorHandling()

  const opportunitiesQuery = useCommittedVolunteeringOpportunitiesQuery({
    fetchPolicy: 'network-only',
    variables: {
      offset: 0,
      limit,
    },
  })

  useEffect(() => {
    if (opportunitiesQuery.error) {
      displayError(opportunitiesQuery.error, 'Failed to load committed volunteering opportunities', {
        location: 'useCommittedVolunteering.committedVolunteeringOpportunitiesQuery',
      })
    }
  }, [opportunitiesQuery.error, displayError])

  const {
    items: opportunitiesData,
    totalResults,
    isLoading,
    isFetchingMore,
    hasMore,
    fetchMore: fetchMoreUtil,
    refetch: refetchUtil,
  } = useTypesenseEnrichedData({
    graphqlQuery: opportunitiesQuery,
    dataExtractor: (data) => data?.committedVolunteeringOpportunities || { data: [], totalResults: 0 },
    typesenseIdExtractor: (item) => toVolunteeringTypesenseId(item.externalVolunteeringOpportunityId),
    typesenseFilter: 'type:=[volunteering]',
    limit,
    itemNormalizer: (committedVolunteeringOpportunity, volunteering) => ({
      id: toVolunteeringTypesenseId(committedVolunteeringOpportunity.externalVolunteeringOpportunityId),
      title: volunteering.title,
      organizerName: volunteering.organizer_name as string,
      imageUrl: volunteering.image_url || '',
      location: volunteering.location || '',
      locationType: volunteering.location_type || '',
      status: committedVolunteeringOpportunity.status,
      externalVolunteeringOpportunityId: committedVolunteeringOpportunity.externalVolunteeringOpportunityId,
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
    error: opportunitiesQuery.error,
  }
}
