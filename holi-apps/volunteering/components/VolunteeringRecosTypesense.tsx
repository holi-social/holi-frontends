import { withProfiler } from '@sentry/react'
import type React from 'react'

import VolunteeringRecosSlider from '@holi-apps/volunteering/components/VolunteeringRecosSlider'
import { useVolunteeringRecosTypesense } from '@holi-apps/volunteering/hooks/useVolunteeringRecosTypesense'

export const ENGAGEMENT_RECOS_PAGE_SIZE = 5

type VolunteeringRecosProps = {
  cardWidth: number
  rows?: number
  columns?: number
}

const VolunteeringRecosTypesense: React.FC<VolunteeringRecosProps> = ({
  cardWidth,
  rows,
  columns,
}: VolunteeringRecosProps) => {
  const pageSize = rows && columns ? rows * columns : ENGAGEMENT_RECOS_PAGE_SIZE
  const { isLoading, engagements } = useVolunteeringRecosTypesense({ pageSize })

  if (isLoading || !engagements.length) {
    return null
  }

  const recosToRender = engagements.slice(0, pageSize)

  return <VolunteeringRecosSlider recos={recosToRender} cardWidth={cardWidth} rows={rows} />
}

export default withProfiler(VolunteeringRecosTypesense, { name: 'VolunteeringRecosTypesense' })
