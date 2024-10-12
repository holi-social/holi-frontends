import React from 'react'
import { useTranslation } from 'react-i18next'

import RecoSlider from '@holi/core/components/RecoSlider'
import { HeartsFilled } from '@holi/icons/src/generated'

import { VolunteeringRecosSliderCard } from '@holi-apps/volunteering/components/VolunteeringRecosSliderCard'
import { VolunteeringEngagement, VolunteeringReco } from '@holi-apps/volunteering/types'

type VolunteeringRecosSliderProps = {
  recos: VolunteeringReco[] | VolunteeringEngagement[]
  cardWidth: number
}

const VolunteeringRecosSlider: React.FC<VolunteeringRecosSliderProps> = ({ recos, cardWidth }) => {
  const { t } = useTranslation()

  return (
    <RecoSlider
      name="volunteering"
      renderItem={(info) => <VolunteeringRecosSliderCard item={info.item} index={info.index} cardWidth={cardWidth} />}
      data={recos}
      icon={HeartsFilled}
      heading={t('volunteering:app.name')}
      subline={t('volunteering:app.subline')}
      seeAllPath="/volunteering"
      labelSeeMore={t('volunteering:listing.loadMoreButton.text')}
      cardWidth={cardWidth}
    />
  )
}

export default VolunteeringRecosSlider
