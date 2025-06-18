import { withProfiler } from '@sentry/react'
import type React from 'react'

import VolunteeringRecosTypesense from '@holi-apps/volunteering/components/VolunteeringRecosTypesense'

type VolunteeringRecosProps = {
  cardWidth: number
  rows?: number
  columns?: number
}

const VolunteeringRecos: React.FC<VolunteeringRecosProps> = ({ cardWidth, rows, columns }: VolunteeringRecosProps) => {
  return <VolunteeringRecosTypesense cardWidth={cardWidth} rows={rows} columns={columns} />
}

export default withProfiler(VolunteeringRecos, { name: 'VolunteeringRecos' })
