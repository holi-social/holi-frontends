import React, { useMemo } from 'react'

import {
  ENGAGEMENT_PAGE_SIZE,
  VolunteeringEngagementList,
} from '@holi-apps/volunteering/components/VolunteeringEngagementList'
import ScrollBasedCallbackInvocation from '@holi/core/components/ScrollBasedCallbackInvocation'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import type { VolunteeringFilters } from '@holi-apps/volunteering/types'
import { useFilteredVolunteeringEngagementsTypesense } from '@holi-apps/volunteering/hooks/useFilteredVolunteeringsEngagementsTypesense'

interface FilteredVolunteeringEngagementsTypesenseProps {
  filters: VolunteeringFilters
  clearFilters?: () => void
  loadingFilters?: boolean
  loadingFiltersFailed?: boolean
}

export const FilteredVolunteeringEngagementsTypesense = ({
  filters,
  loadingFilters = false,
  clearFilters,
  loadingFiltersFailed = false,
}: FilteredVolunteeringEngagementsTypesenseProps) => {
  const { styles } = useStyles(stylesheet)

  const { isLoading, engagements, canFetchMore, fetchNextPage, totalResults } =
    useFilteredVolunteeringEngagementsTypesense({
      filters,
      loadingFilters,
      pageSize: ENGAGEMENT_PAGE_SIZE,
    })

  const loadMoreComponent = useMemo(() => {
    return (
      <ScrollBasedCallbackInvocation
        callback={fetchNextPage}
        placeholder={<HoliLoader style={styles.loaderBottom} testID="volunteering-loader" />}
      />
    )
  }, [fetchNextPage, styles.loaderBottom])

  return (
    <VolunteeringEngagementList
      isFiltering={true}
      loadingFailed={loadingFiltersFailed}
      clearFilters={clearFilters}
      engagements={engagements}
      isLoading={isLoading || loadingFilters}
      totalResults={totalResults}
      footerComponent={canFetchMore && loadMoreComponent}
    />
  )
}

const stylesheet = createStyleSheet({
  loaderBottom: {
    marginBottom: 24,
    position: 'relative',
  },
})
