import React, { memo } from 'react'

import InitiativeCard from '@holi/core/screens/insights/initiatives/InitiativeCard'
import { Initiative } from '@holi/core/screens/insights/types'
import HoliCarousel from '@holi/ui/components/organisms/HoliCarousel'

export interface InitiativesCarouselProps {
  insightId: string
  marginHorizontal: number
  initiatives: Initiative[]
  slideWidth?: number
}

const InitiativesCarousel = ({ initiatives, insightId, marginHorizontal, slideWidth }: InitiativesCarouselProps) => {
  return (
    <HoliCarousel
      hideDotIndicators
      marginHorizontal={marginHorizontal}
      slideWidth={slideWidth}
      slides={initiatives.map((initiative) => ({
        children: <InitiativeCard insightId={insightId} initiative={initiative} />,
      }))}
    />
  )
}
export default memo(InitiativesCarousel)
