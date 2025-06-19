import React, { useMemo } from 'react'

import {
  ENGAGEMENT_PAGE_SIZE,
  VolunteeringEngagementList,
} from '@holi-apps/volunteering/components/VolunteeringEngagementList'
import ScrollBasedCallbackInvocation from '@holi/core/components/ScrollBasedCallbackInvocation'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { createStyleSheet, useStyles } from 'holi-bricks/styles'
import type { VolunteeringFilters } from '@holi-apps/volunteering/types'
import { useFilteredVolunteeringEngagements } from '@holi-apps/volunteering/hooks/useFilteredVolunteeringsEngagements'

interface FilteredVolunteeringEngagementsProps {
  filters: VolunteeringFilters
  clearFilters?: () => void
  loadingFilters?: boolean
  loadingFiltersFailed?: boolean
}

export const FilteredVolunteeringEngagements = ({
  filters,
  loadingFilters = false,
  clearFilters,
  loadingFiltersFailed = false,
}: FilteredVolunteeringEngagementsProps) => {
  const { styles } = useStyles(stylesheet)

  const { isLoading, engagements, canFetchMore, fetchNextPage, totalResults } = useFilteredVolunteeringEngagements({
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
