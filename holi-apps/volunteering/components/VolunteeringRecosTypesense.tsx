import { withProfiler } from '@sentry/react'
import type React from 'react'

import VolunteeringRecosSlider from '@holi-apps/volunteering/components/VolunteeringRecosSlider'
import { useVolunteeringRecosTypesense } from '@holi-apps/volunteering/hooks/useVolunteeringRecosTypesense'

export const ENGAGEMENT_RECOS_PAGE_SIZE = 5

type VolunteeringRecosProps = {
  cardWidth: number
}

const VolunteeringRecosTypesense: React.FC<VolunteeringRecosProps> = ({ cardWidth }: VolunteeringRecosProps) => {
  const { isLoading, engagements } = useVolunteeringRecosTypesense({ pageSize: ENGAGEMENT_RECOS_PAGE_SIZE })

  if (isLoading || !engagements.length) {
    return null
  }

  const recosToRender = engagements.slice(0, ENGAGEMENT_RECOS_PAGE_SIZE)

  return <VolunteeringRecosSlider recos={recosToRender} cardWidth={cardWidth} />
}

export default withProfiler(VolunteeringRecosTypesense, { name: 'VolunteeringRecosTypesense' })
