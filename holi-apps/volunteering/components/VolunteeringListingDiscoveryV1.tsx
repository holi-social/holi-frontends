import { withProfiler } from '@sentry/react'
import React from 'react'
import { StyleSheet } from 'react-native'

import { logError } from '@holi/core/errors/helpers'
import { useRefetchOnClientSideForLoggedInWebUser } from '@holi/core/helpers/useRefetchOnClientSide'
import { Pagination } from '@holi/core/pagination/Pagination'
import { PaginationQueryHookOptions } from '@holi/core/pagination/usePaginationQuery'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

import {
  ENGAGEMENT_PAGE_SIZE,
  VolunteeringEngagementList,
} from '@holi-apps/volunteering/components/VolunteeringEngagementList'
import VolunteeringListingSkeleton from '@holi-apps/volunteering/components/VolunteeringListingSkeleton'
import { useVolunteeringRecosQueryVariables } from '@holi-apps/volunteering/hooks/useVolunteeringRecosQueryVariables'
import { filteredVolunteeringEngagementsQuery, volunteeringRecosQuery } from '@holi-apps/volunteering/queries'
import { VolunteeringFilters } from '@holi-apps/volunteering/types'

type VolunteeringListingProps = {
  filters: VolunteeringFilters
  isFiltering?: boolean
  clearFilters?: () => void
  loadingFilters: boolean
  loadingFiltersFailed?: boolean
}

const VolunteeringRecommendations = () => {
  const { queryVariables, loading: loadingQueryVariables = false } = useVolunteeringRecosQueryVariables()

  const queryOptions: PaginationQueryHookOptions = {
    pageSize: ENGAGEMENT_PAGE_SIZE,
    queryPath: 'appVolunteering_engagementRecos',
    variables: queryVariables,
    skip: loadingQueryVariables,
  }
  const reloading = useRefetchOnClientSideForLoggedInWebUser(volunteeringRecosQuery, {
    variables: {
      ...queryVariables,
      limit: ENGAGEMENT_PAGE_SIZE,
      offset: 0,
    },
    onError: (error) =>
      logError(error, 'Failed to reload volunteering recommendations', {
        location: 'VolunteeringRecommendations.useRefetchOnClientSideForLoggedInWebUser',
      }),
  })

  return (
    <Pagination
      query={volunteeringRecosQuery}
      queryOptions={queryOptions}
      loadMoreOnScroll
      scrollPlaceholder={<HoliLoader style={styles.loaderBottom} testID="volunteering-loader" />}
    >
      {loadingQueryVariables || reloading ? (
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
      scrollPlaceholder={<HoliLoader style={styles.loaderBottom} testID="volunteering-loader" />}
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

const VolunteeringListingDiscoveryV1 = (props: VolunteeringListingProps) => {
  if (props.isFiltering) {
    return <FilteredVolunteeringEngagements {...props} />
  }
  return <VolunteeringRecommendations />
}

export default withProfiler(VolunteeringListingDiscoveryV1, { name: 'VolunteeringListingDiscoveryV1' })

const styles = StyleSheet.create({
  loaderBottom: {
    marginBottom: 24,
    position: 'relative',
  },
})
