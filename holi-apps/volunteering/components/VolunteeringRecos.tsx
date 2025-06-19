import { withProfiler } from '@sentry/react'
import type React from 'react'

import VolunteeringRecosSlider from '@holi-apps/volunteering/components/VolunteeringRecosSlider'
import { useVolunteeringRecos } from '@holi-apps/volunteering/hooks/useVolunteeringRecos'

export const ENGAGEMENT_RECOS_PAGE_SIZE = 5

type VolunteeringRecosProps = {
  cardWidth: number
  rows?: number
  columns?: number
}

const VolunteeringRecos: React.FC<VolunteeringRecosProps> = ({ cardWidth, rows, columns }: VolunteeringRecosProps) => {
  const pageSize = rows && columns ? rows * columns : ENGAGEMENT_RECOS_PAGE_SIZE
  const { isLoading, engagements } = useVolunteeringRecos({ pageSize })

  if (isLoading || !engagements.length) {
    return null
  }

  const recosToRender = engagements.slice(0, pageSize)

  return <VolunteeringRecosSlider recos={recosToRender} cardWidth={cardWidth} rows={rows} />
}

export default withProfiler(VolunteeringRecos, { name: 'VolunteeringRecos' })
