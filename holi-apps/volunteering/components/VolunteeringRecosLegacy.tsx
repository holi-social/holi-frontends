import { withProfiler } from '@sentry/react'
import type React from 'react'

import VolunteeringRecosSlider from '@holi-apps/volunteering/components/VolunteeringRecosSlider'
import { useVolunteeringRecosLegacy } from '@holi-apps/volunteering/hooks/useVolunteeringRecosLegacy'

export const ENGAGEMENT_PAGE_SIZE = 5

type VolunteeringRecosProps = {
  cardWidth: number
}

const VolunteeringRecosLegacy: React.FC<VolunteeringRecosProps> = ({ cardWidth }: VolunteeringRecosProps) => {
  const { isLoading, engagements } = useVolunteeringRecosLegacy({ pageSize: ENGAGEMENT_PAGE_SIZE })

  if (isLoading) {
    return null
  }

  const recosToRender = engagements.slice(0, ENGAGEMENT_PAGE_SIZE)

  return <VolunteeringRecosSlider recos={recosToRender} cardWidth={cardWidth} />
}

export default withProfiler(VolunteeringRecosLegacy, { name: 'VolunteeringRecosLegacy' })
