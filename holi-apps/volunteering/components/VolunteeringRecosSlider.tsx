import type React from 'react'
import { useTranslation } from 'react-i18next'

import RecoSlider from '@holi/core/components/RecoSlider'
import { TrackingEvent } from '@holi/core/tracking'
import type { ListItemIdentifier, ListItemTrackingEvent } from '@holi/core/tracking/TrackableFlatList.shared'
import { HeartsFilled } from '@holi/icons/src/generated'

import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { VolunteeringRecoCard } from '@holi-apps/volunteering/components/VolunteeringRecoCard'
import { useCardWidth } from '@holi/core/screens/homeFeed/components/Recommendations'

type VolunteeringRecosSliderProps = {
  recos: LocalizedTypesenseDocument[]
  cardWidth: number
}

const VolunteeringRecosSlider = ({ recos }: VolunteeringRecosSliderProps) => {
  const { t } = useTranslation()
  const cardWidth = useCardWidth()

  const listItemTrackingEvent: ListItemTrackingEvent<LocalizedTypesenseDocument> = (item) => {
    return TrackingEvent.RecommendationViewed(item.type === 'task' ? 'space_task' : 'volunteering_opportunity', {
      title: item?.title,
      id: item?.id,
      commitmentType: item.commitment_label,
      locationType: item.location_type,
      source: item.source,
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
      renderItem={(info) => <VolunteeringRecoCard engagement={info.item} index={info.index} fixedWidth={cardWidth} />}
      data={recos}
      icon={HeartsFilled}
      heading={t('volunteering:app.name')}
      subline={t('volunteering:app.subline')}
      seeAllPath="/volunteering"
      cardWidth={cardWidth}
    />
  )
}

export default VolunteeringRecosSlider
