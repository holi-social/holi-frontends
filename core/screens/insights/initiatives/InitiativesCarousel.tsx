import React, { memo } from 'react'

import InitiativeCard from '@holi/core/screens/insights/initiatives/InitiativeCard'
import { Initiative } from '@holi/core/screens/insights/types'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'

export interface InitiativesCarouselProps {
  insightId: string
  initiatives: Initiative[]
}

const InitiativesCarousel = ({ initiatives, insightId }: InitiativesCarouselProps) => {
  return (
    <HoliCarousel
      hideDotIndicators
      marginHorizontal={20}
      slides={initiatives.map((initiative) => ({
        children: <InitiativeCard insightId={insightId} initiative={initiative} />,
      }))}
    />
  )
}
export default memo(InitiativesCarousel)
