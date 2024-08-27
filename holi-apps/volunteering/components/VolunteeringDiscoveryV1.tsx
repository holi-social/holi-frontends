import { withProfiler } from '@sentry/react'
import React from 'react'
import { StyleSheet } from 'react-native'

import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

import {
  ENGAGEMENT_PAGE_SIZE,
  VolunteeringEngagementList,
} from '@holi-apps/volunteering/components/VolunteeringEngagementList'
import VolunteeringListingSkeleton from '@holi-apps/volunteering/components/VolunteeringListingSkeleton'
import { useVolunteeringRecosV1QueryVariables } from '@holi-apps/volunteering/hooks/useVolunteeringRecosV1QueryVariables'
import { filteredVolunteeringEngagementsQuery, volunteeringRecosV1Query } from '@holi-apps/volunteering/queries'
import { VolunteeringFilters } from '@holi-apps/volunteering/types'

type VolunteeringListingProps = {
  filters: VolunteeringFilters
  isFiltering?: boolean
  clearFilters?: () => void
  loadingFilters: boolean
  loadingFiltersFailed?: boolean
}

const VolunteeringRecommendations = ({ isFiltering }: { isFiltering?: boolean }) => {
  const { queryVariables, loading: loadingQueryVariables = false } = useVolunteeringRecosV1QueryVariables()
  // TODO(SF) ensure refetch on web for logged in user?

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: ENGAGEMENT_PAGE_SIZE,
    queryPath: 'appVolunteering_engagementRecommendations',
    variables: queryVariables,
    skip: isFiltering || loadingQueryVariables,
  }

  return (
    <Pagination
      query={volunteeringRecosV1Query}
      queryOptions={queryOptions}
      loadMoreOnScroll
      scrollPlaceholder={<HoliLoader style={styles.loaderBottom} />}
    >
      {loadingQueryVariables ? (
        <VolunteeringListingSkeleton isFiltering={false} amount={ENGAGEMENT_PAGE_SIZE} />
      ) : (
        <VolunteeringEngagementList />
      )}
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
    queryPath: 'appVolunteering_filteredEngagements',
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
      scrollPlaceholder={<HoliLoader style={styles.loaderBottom} />}
    >
      {loadingFilters ? (
        <VolunteeringListingSkeleton isFiltering={true} amount={ENGAGEMENT_PAGE_SIZE} />
      ) : (
        <VolunteeringEngagementList
          clearFilters={clearFilters}
          loadingFailed={loadingFiltersFailed}
          isFiltering={true}
        />
      )}
    </Pagination>
  )
}

const VolunteeringDiscoveryV1 = (props: VolunteeringListingProps) => {
  if (props.isFiltering) {
    return <FilteredVolunteeringEngagements {...props} />
  }
  return <VolunteeringRecommendations isFiltering={props.isFiltering} />
}

export default withProfiler(VolunteeringDiscoveryV1, { name: 'VolunteeringDiscoveryV1' })

const styles = StyleSheet.create({
  loaderBottom: {
    marginBottom: 24,
    position: 'relative',
  },
})
