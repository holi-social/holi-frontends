import { withProfiler } from '@sentry/react'
import React from 'react'
import { StyleSheet } from 'react-native'

import { Pagination, usePaginationContext } from '@holi/core/pagination/Pagination'
import type { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

import {
  ENGAGEMENT_PAGE_SIZE,
  VolunteeringEngagementList,
} from '@holi-apps/volunteering/components/VolunteeringEngagementList'
import { useVolunteeringRecosQueryVariables } from '@holi-apps/volunteering/hooks/useVolunteeringRecosQueryVariables'
import { filteredVolunteeringEngagementsQuery, volunteeringRecosQuery } from '@holi-apps/volunteering/queries'
import type { VolunteeringEngagement, VolunteeringFilters, VolunteeringReco } from '@holi-apps/volunteering/types'
import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'
import { VolunteeringTypesenseRecommendations } from '@holi-apps/volunteering/components/VolunteeringTypesenseRecommendations'
import { FilteredVolunteeringEngagementsTypesense } from '@holi-apps/volunteering/components/FilteredVolunteeringEngagementsTypesense'

type VolunteeringListingProps = {
  filters: VolunteeringFilters
  isFiltering?: boolean
  clearFilters?: () => void
  loadingFilters: boolean
  loadingFiltersFailed?: boolean
}

interface VolunteeringEngagementListLegacyProps {
  isFiltering?: boolean
  loadingFailed?: boolean
  clearFilters?: () => void
  loadingFilters?: boolean
}

const VolunteeringEngagementListLegacy = ({
  isFiltering,
  loadingFailed,
  clearFilters,
  loadingFilters,
}: VolunteeringEngagementListLegacyProps) => {
  const {
    loading: engagementsLoading,
    data: engagements,
    totalResults,
  } = usePaginationContext<VolunteeringEngagement | VolunteeringReco>()

  return (
    <VolunteeringEngagementList
      isFiltering={isFiltering}
      loadingFailed={loadingFailed}
      clearFilters={clearFilters}
      isLoading={engagementsLoading || loadingFilters}
      engagements={engagements}
      totalResults={totalResults}
    />
  )
}

const VolunteeringRecommendations = () => {
  const { queryVariables, loading: loadingQueryVariables = false } = useVolunteeringRecosQueryVariables()

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: ENGAGEMENT_PAGE_SIZE,
    queryPath: 'appVolunteering_engagementRecosV2',
    variables: queryVariables,
    skip: loadingQueryVariables,
  }

  return (
    <Pagination
      query={volunteeringRecosQuery}
      queryOptions={queryOptions}
      loadMoreOnScroll
      scrollPlaceholder={<HoliLoader style={styles.loaderBottom} testID="volunteering-loader" />}
    >
      <VolunteeringEngagementListLegacy loadingFilters={loadingQueryVariables} />
    </Pagination>
  )
}

const FilteredVolunteeringEngagements = ({
  filters = {},
  isFiltering,
  clearFilters,
  loadingFilters,
  loadingFiltersFailed,
}: VolunteeringListingProps) => {
  const queryOptions: PaginationQueryHookOptions = {
    pageSize: ENGAGEMENT_PAGE_SIZE,
    queryPath: 'appVolunteering_filteredEngagementsV2',
    variables: {
      geolocationId: filters.location?.id,
      skills: filters.skills || [],
      topics: filters.topics || [],
    },
    skip: !isFiltering || loadingFilters,
  }

  return (
    <Pagination
      query={filteredVolunteeringEngagementsQuery}
      queryOptions={queryOptions}
      loadMoreOnScroll
      scrollPlaceholder={<HoliLoader style={styles.loaderBottom} testID="volunteering-loader" />}
    >
      <VolunteeringEngagementListLegacy
        clearFilters={clearFilters}
        loadingFailed={loadingFiltersFailed}
        isFiltering={true}
        loadingFilters={loadingFilters}
      />
    </Pagination>
  )
}

const VolunteeringListingDiscovery = (props: VolunteeringListingProps) => {
  const [useTypesense] = useFeatureFlag(FeatureFlagKey.TYPESENSE_RECOS)
  if (props.isFiltering) {
    return useTypesense ? (
      <FilteredVolunteeringEngagementsTypesense {...props} />
    ) : (
      <FilteredVolunteeringEngagements {...props} />
    )
  }
  return useTypesense ? <VolunteeringTypesenseRecommendations /> : <VolunteeringRecommendations />
}

export default withProfiler(VolunteeringListingDiscovery, { name: 'VolunteeringListingDiscovery' })

const styles = StyleSheet.create({
  loaderBottom: {
    marginBottom: 24,
    position: 'relative',
  },
})
