import { withProfiler } from '@sentry/react'
import React from 'react'

import type { VolunteeringFilters } from '@holi-apps/volunteering/types'
import { VolunteeringTypesenseRecommendations } from '@holi-apps/volunteering/components/VolunteeringTypesenseRecommendations'
import { FilteredVolunteeringEngagementsTypesense } from '@holi-apps/volunteering/components/FilteredVolunteeringEngagementsTypesense'

type VolunteeringListingProps = {
  filters: VolunteeringFilters
  isFiltering?: boolean
  clearFilters?: () => void
  loadingFilters: boolean
  loadingFiltersFailed?: boolean
}

const VolunteeringListingDiscovery = (props: VolunteeringListingProps) => {
  if (props.isFiltering) {
    return <FilteredVolunteeringEngagementsTypesense {...props} />
  }
  return <VolunteeringTypesenseRecommendations />
}

export default withProfiler(VolunteeringListingDiscovery, { name: 'VolunteeringListingDiscovery' })
