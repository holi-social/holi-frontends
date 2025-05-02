import type React from 'react'
import { useTranslation } from 'react-i18next'

import RecoSlider from '@holi/core/components/RecoSlider'
import { TrackingEvent } from '@holi/core/tracking'
import type { ListItemIdentifier, ListItemTrackingEvent } from '@holi/core/tracking/TrackableFlatList.shared'
import { HeartsFilled } from '@holi/icons/src/generated'

import { VolunteeringRecosSliderCard } from '@holi-apps/volunteering/components/VolunteeringRecosSliderCard'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'

type VolunteeringRecosSliderProps = {
  recos: LocalizedTypesenseDocument[]
  cardWidth: number
}

const VolunteeringRecosSlider = ({ recos, cardWidth }: VolunteeringRecosSliderProps) => {
  const { t } = useTranslation()

  const listItemTrackingEvent: ListItemTrackingEvent<LocalizedTypesenseDocument> = (item) => {
    return TrackingEvent.RecommendationViewed('volunteering_opportunity', {
      title: item?.title,
      id: item?.id,
    })
  }

  const listItemIdentifier: ListItemIdentifier<LocalizedTypesenseDocument> = (item) => item.id

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
