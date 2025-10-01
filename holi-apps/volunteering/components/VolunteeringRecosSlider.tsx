import type React from 'react'
import { useTranslation } from 'react-i18next'

import RecoSlider from '@holi/core/components/RecoSlider'
import { TrackingEvent } from '@holi/core/tracking'
import type { ListItemIdentifier, ListItemTrackingEvent } from '@holi/core/tracking/TrackableFlatList.shared'
import { HandHeartsFilled } from '@holi/icons/src/generated'

import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { VolunteeringRecoCard } from '@holi-apps/volunteering/components/VolunteeringRecoCard'
import { Stack } from 'holi-bricks/components/stack'
import chunk from 'lodash.chunk'
import { useRecoCardWidth } from '@holi/core/helpers/useRecoCardWidth'

type VolunteeringRecosSliderProps = {
  recos: LocalizedTypesenseDocument[]
  cardWidth: number
  rows?: number
}

const VolunteeringRecosSlider = ({ recos, rows = 1 }: VolunteeringRecosSliderProps) => {
  const { t } = useTranslation()
  const cardWidth = useRecoCardWidth()

  const listItemTrackingEvent: ListItemTrackingEvent<LocalizedTypesenseDocument> = (item) => {
    return TrackingEvent.RecommendationViewed(item.type === 'task' ? 'space_task' : 'volunteering_opportunity', {
      title: item?.title,
      id: item?.id,
      commitmentType: item.commitment_label,
      locationType: item.location_type,
      source: item.source,
      sourceSection: 'Volunteering',
    })
  }

  const listItemIdentifier: ListItemIdentifier<LocalizedTypesenseDocument> = (item) => item.id

  const columns = chunk(recos, rows)

  return (
    <RecoSlider
      name="volunteering"
      viewTrackingParams={{
        listItemTrackingEvent,
        listItemIdentifier,
      }}
      renderItem={(info) =>
        rows > 1 ? (
          <Stack gap="3xs">
            {info.item.map((item: LocalizedTypesenseDocument, index: number) => (
              <VolunteeringRecoCard
                key={item.id}
                engagement={item}
                index={info.index * rows + index}
                fixedWidth={cardWidth}
              />
            ))}
          </Stack>
        ) : (
          <VolunteeringRecoCard engagement={info.item[0]} index={info.index} fixedWidth={cardWidth} />
        )
      }
      data={columns}
      icon={HandHeartsFilled}
      heading={t('volunteering.app.name')}
      subline={t('volunteering.app.subline')}
      seeAllPath="/volunteering"
      seeMoreCard={false}
    />
  )
}

export default VolunteeringRecosSlider
