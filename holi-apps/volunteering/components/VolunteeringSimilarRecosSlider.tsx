import { VolunteeringRecosSliderCard } from '@holi-apps/volunteering/components/VolunteeringRecosSliderCard'
import type { VolunteeringEngagement } from '@holi-apps/volunteering/types'
import { withProfiler } from '@sentry/react'
import type React from 'react'
import { FlatList } from 'react-native'

export const MAX_RECOS_COUNT = 4

type VolunteeringSimilarRecosProps = {
  cardWidth: number
  recos: VolunteeringEngagement[]
}

const VolunteeringSimilarRecosSlider: React.FC<VolunteeringSimilarRecosProps> = ({
  cardWidth,
  recos,
}: VolunteeringSimilarRecosProps) => {
  const recosToRender = recos.slice(0, MAX_RECOS_COUNT)

  return (
    recosToRender.length > 0 && (
      <FlatList
        horizontal
        data={recosToRender}
        renderItem={(info) => <VolunteeringRecosSliderCard item={info.item} index={info.index} cardWidth={cardWidth} />}
      />
    )
  )
}

export default withProfiler(VolunteeringSimilarRecosSlider, { name: 'VolunteeringRecos' })
