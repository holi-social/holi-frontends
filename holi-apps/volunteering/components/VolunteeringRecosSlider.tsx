import type React from 'react'
import { useTranslation } from 'react-i18next'

import RecoSlider from '@holi/core/components/RecoSlider'
import { TrackingEvent } from '@holi/core/tracking'
import type { ListItemIdentifier, ListItemTrackingEvent } from '@holi/core/tracking/TrackableFlatList.shared'
import { HeartsFilled } from '@holi/icons/src/generated'

import { VolunteeringRecosSliderCard } from '@holi-apps/volunteering/components/VolunteeringRecosSliderCard'
import type { VolunteeringEngagement, VolunteeringReco } from '@holi-apps/volunteering/types'

type VolunteeringRecosSliderProps = {
  recos: VolunteeringReco[] | VolunteeringEngagement[]
  cardWidth: number
}

const VolunteeringRecosSlider: React.FC<VolunteeringRecosSliderProps> = ({ recos, cardWidth }) => {
  const { t } = useTranslation()

  const listItemTrackingEvent: ListItemTrackingEvent<VolunteeringReco | VolunteeringEngagement> = (item) => {
    const engagement = 'engagement' in item ? item.engagement : item
    return TrackingEvent.RecommendationViewed('volunteering_opportunity', {
      title: engagement?.title as string,
      id: engagement?.id as string,
    })
  }

  const listItemIdentifier: ListItemIdentifier<VolunteeringReco | VolunteeringEngagement> = (item) => {
    const engagement = 'engagement' in item ? item.engagement : item

    return engagement.id as string
  }

  return (
    <RecoSlider
      name="volunteering"
      viewTrackingParams={{
        listItemTrackingEvent,
        listItemIdentifier,
      }}
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
