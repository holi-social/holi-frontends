import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import RecoSliderCard from '@holi/core/components/RecoSliderCard'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Globe } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'

import { VolunteeringLabels } from '@holi-apps/volunteering/components/VolunteeringLabels'
import { Text } from 'holi-bricks/components/text'
import type { LocalizedTypesenseDocument } from '@holi/core/typesense/types'
import { linkFromLocator } from '@holi/core/typesense/helpers/linkFromLocator'

export type VolunteeringRecosSliderCardProps = {
  item: LocalizedTypesenseDocument
  /**  the index of this card in the slider */
  index: number
  cardWidth: number
}

export const VolunteeringRecosSliderCard = ({
  item: engagement,
  index,
  cardWidth,
}: VolunteeringRecosSliderCardProps) => {
  const { t } = useTranslation()

  const title = engagement?.organizer_name
    ? t('volunteering:engagement.title', {
        title: engagement.title,
        organization: engagement.organizer_name,
        interpolation: { escapeValue: false },
      })
    : (engagement.title ?? '')

  const link = linkFromLocator(engagement.type, engagement.link_locators)

  return (
    <RecoSliderCard
      name="volunteering"
      to={link}
      labels={
        (engagement?.topics_v2?.length || engagement?.skills_v2?.length) && (
          <>
            <VolunteeringLabels
              displayAll={false}
              topicSlugs={engagement?.topics_v2}
              skillSlugs={engagement?.skills_v2}
            />
            <HoliGap size={'xs'} />
          </>
        )
      }
      title={title}
      imageSourceUri={engagement?.image_url}
      imageFallback={require('@holi/ui/assets/img/illustrations/illustration_task.svg')}
      footer={
        !!engagement?.location && (
          <View style={styles.locationFooter}>
            <HoliIcon icon={Globe} testID={'volunteering-reco-slider-card-location-icon'} />
            <Text size="sm">{engagement?.location}</Text>
          </View>
        )
      }
      trackingEvent={TrackingEvent.RecommendationPressed(
        engagement.type === 'task' ? 'space_task' : 'volunteering_opportunity',
        engagement?.id ?? '',
        index
      )}
      cardWidth={cardWidth}
    />
  )
}

const styles = StyleSheet.create({
  locationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
})
