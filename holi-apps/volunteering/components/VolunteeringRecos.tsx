import { withProfiler } from '@sentry/react'
import type React from 'react'

import { useFeatureFlag } from '@holi/core/featureFlags/hooks/useFeatureFlag'
import VolunteeringRecosTypesense from '@holi-apps/volunteering/components/VolunteeringRecosTypesense'
import VolunteeringRecosLegacy from '@holi-apps/volunteering/components/VolunteeringRecosLegacy'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

type VolunteeringRecosProps = {
  cardWidth: number
  rows?: number
  columns?: number
}

const VolunteeringRecos: React.FC<VolunteeringRecosProps> = ({ cardWidth, rows, columns }: VolunteeringRecosProps) => {
  const [useTypesense] = useFeatureFlag(FeatureFlagKey.TYPESENSE_RECOS)
  return useTypesense ? (
    <VolunteeringRecosTypesense cardWidth={cardWidth} rows={rows} columns={columns} />
  ) : (
    <VolunteeringRecosLegacy cardWidth={cardWidth} />
  )
}

export default withProfiler(VolunteeringRecos, { name: 'VolunteeringRecos' })
