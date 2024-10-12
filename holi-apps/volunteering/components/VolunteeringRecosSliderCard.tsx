import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import RecoSliderCard from '@holi/core/components/RecoSliderCard'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Globe } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliText from '@holi/ui/components/atoms/HoliText'

import { VolunteeringLabels } from '@holi-apps/volunteering/components/VolunteeringLabels'
import { VolunteeringEngagement, VolunteeringReco } from '@holi-apps/volunteering/types'

export type VolunteeringRecosSliderCardProps = {
  item: VolunteeringReco | VolunteeringEngagement
  /**  the index of this card in the slider */
  index: number
  cardWidth: number
}

export const VolunteeringRecosSliderCard = ({
  item: engagementOrReco,
  index,
  cardWidth,
}: VolunteeringRecosSliderCardProps) => {
  const { t } = useTranslation()

  const isReco = 'engagement' in engagementOrReco
  const engagement = isReco ? engagementOrReco.engagement : engagementOrReco

  const title = engagement.organizer?.name
    ? t('volunteering:engagement.title', {
        title: engagement.title,
        organization: engagement.organizer?.name,
        interpolation: { escapeValue: false },
      })
    : engagement.title

  const hasTopics = isReco
    ? engagementOrReco.matchedTopics && engagementOrReco.matchedTopics?.length > 0
    : engagement.topics && engagement.topics?.length > 0

  const hasSkills = isReco
    ? engagementOrReco.matchedSkills && engagementOrReco.matchedSkills?.length > 0
    : engagement.skills && engagement.skills?.length > 0

  return (
    <RecoSliderCard
      name="volunteering"
      to={`/volunteering/${engagement.id}`}
      labels={
        (hasTopics || hasSkills) && (
          <>
            <VolunteeringLabels
              displayAll={false}
              topicSlugs={isReco ? engagementOrReco.matchedTopics : engagement.topics}
              skillSlugs={isReco ? engagementOrReco.matchedSkills : engagement.skills}
            />
            <HoliGap size={'xs'} />
          </>
        )
      }
      title={title}
      imageSourceUri={engagement.imageUrl}
      footer={
        !!engagement.location && (
          <View style={styles.locationFooter}>
            <HoliIcon icon={Globe} testID={'volunteering-reco-slider-card-location-icon'} />
            <HoliText size="small">{engagement.location}</HoliText>
          </View>
        )
      }
      trackingEvent={TrackingEvent.RecommendationPressed('volunteering_opportunity', engagement.id, index)}
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
