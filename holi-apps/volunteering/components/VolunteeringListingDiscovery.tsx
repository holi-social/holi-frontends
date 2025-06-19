import { withProfiler } from '@sentry/react'
import React from 'react'

import type { VolunteeringFilters } from '@holi-apps/volunteering/types'
import { VolunteeringRecommendations } from '@holi-apps/volunteering/components/VolunteeringRecommendations'
import { FilteredVolunteeringEngagements } from '@holi-apps/volunteering/components/FilteredVolunteeringEngagements'

type VolunteeringListingProps = {
  filters: VolunteeringFilters
  isFiltering?: boolean
  clearFilters?: () => void
  loadingFilters: boolean
  loadingFiltersFailed?: boolean
}

const VolunteeringListingDiscovery = (props: VolunteeringListingProps) => {
  if (props.isFiltering) {
    return <FilteredVolunteeringEngagements {...props} />
  }
  return <VolunteeringRecommendations />
}

export default withProfiler(VolunteeringListingDiscovery, { name: 'VolunteeringListingDiscovery' })
