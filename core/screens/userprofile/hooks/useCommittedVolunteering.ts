import {
  useCommittedVolunteeringOpportunitiesQuery,
  useTypesense_MultiSearchQuery,
  VolunteeringOpportunityStatus,
  type VolunteeringOpportunityStatusValue,
} from '@holi/api/graphql/graphql-codegen'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useEffect } from 'react'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { localizeTypesenseDocument } from '@holi/core/typesense/helpers/localizeTypesenseDocument'
import { useUserLanguage } from '@holi/core/screens/search/hooks/useUserLanguage'

export type EngagementEntry = {
  id: string
  title: string
  organizerName: string
  imageUrl: string
  location?: string
  locationType?: string
  status: VolunteeringOpportunityStatusValue
  type: string
  link: string
}

//todo gregor: useEngagements
export const useCommittedVolunteering = (
  limit = 100
): {
  refetch: () => Promise<void>
  items: EngagementEntry[]
  isLoading: boolean
  isInitialLoad: boolean
  hasError: boolean
} => {
  const language = useUserLanguage()
  const { displayError } = useErrorHandling()

  const okunaQuery = useCommittedVolunteeringOpportunitiesQuery({
    fetchPolicy: 'network-only',
    variables: {
      offset: 0,
      limit,
    },
  })

  const okunaVos = okunaQuery.data?.committedVolunteeringOpportunities?.data ?? []

  const typesenseIdsToSearchFor = okunaVos.reduce((acc: string[], curr) => {
    // we don't know what model type the user has committed to, so lets search for both in typesense
    acc.push(`volunteering_${curr.externalVolunteeringOpportunityId}`)
    acc.push(`task_${curr.externalVolunteeringOpportunityId}`)
    return acc
  }, [])

  const typesenseSearchQuery = useTypesense_MultiSearchQuery({
    variables: {
      input: {
        searches: [
          {
            q: '*',
            filter_by: `type:=[volunteering, task] && id:=[${typesenseIdsToSearchFor.join(', ')}]`,
            limit: typesenseIdsToSearchFor.length || 100,
          },
        ],
      },
    },
  })

  useEffect(() => {
    if (okunaQuery.error) {
      displayError(okunaQuery.error, 'Failed to load okuna data', {
        location: 'useCommittedVolunteering.useCommittedVolunteeringOpportunitiesQuery',
      })
    }
    if (typesenseSearchQuery.error) {
      displayError(typesenseSearchQuery.error, 'Failed to search for typesense data', {
        location: 'useCommittedVolunteering.useTypesense_MultiSearchQuery',
      })
    }
  }, [typesenseSearchQuery.error, okunaQuery.error, displayError])

  const typesenseVOs =
    typesenseSearchQuery.data?.typesense_multiSearch?.results.reduce((acc: LocalizedTypesenseDocument[], curr) => {
      if ('Typesense_SearchResponseSuccess' === curr.__typename) {
        const hits = curr.hits ?? []
        acc.push(...(hits.map(({ document }) => localizeTypesenseDocument(document, language)) ?? []))
      }
      return acc
    }, []) ?? []

  const engagements = okunaVos.reduce((acc: EngagementEntry[], okunaVo) => {
    const relatedTypesenseVo = typesenseVOs.find((typesenseVO) => {
      const rawTypesenseVoId = typesenseVO.link_locators?.volunteering ?? typesenseVO.link_locators?.task
      return rawTypesenseVoId === okunaVo.externalVolunteeringOpportunityId
    })

    if (relatedTypesenseVo) {
      const engagement = mapToEngagement(okunaVo, relatedTypesenseVo)
      acc.push(engagement)
    }

    return acc
  }, [])

  const refetch = async () => {
    try {
      await okunaQuery.refetch()
      await typesenseSearchQuery.refetch()
    } catch (error) {
      displayError(error as Error, 'Failed to refetch engagements', {
        location: 'useCommittedVolunteering.refetch',
      })
    }
  }

  return {
    items: engagements,
    isLoading: !!okunaQuery.loading || !!typesenseSearchQuery.loading,
    isInitialLoad: okunaVos.length === 0 && okunaQuery.loading && typesenseSearchQuery.loading,
    refetch,
    hasError: !!okunaQuery.error || !!typesenseSearchQuery.error,
  }
}

const mapToEngagement = (
  okunaData: VolunteeringOpportunityStatus,
  typesenseData: LocalizedTypesenseDocument
): EngagementEntry => {
  const linkByType: Record<string, string> = {
    volunteering: `/volunteering/${typesenseData.link_locators?.volunteering}`,
    task: `/spaces/${typesenseData.link_locators?.space}/tasks/${typesenseData.link_locators?.task}`,
  }

  return {
    id: okunaData.externalVolunteeringOpportunityId,
    status: okunaData.status,
    type: typesenseData.type,
    title: typesenseData.title,
    organizerName: typesenseData.organizer_name as string,
    imageUrl: typesenseData.image_url || '',
    location: typesenseData.location || '',
    locationType: typesenseData.location_type || '',
    link: linkByType[typesenseData.type],
  }
}
