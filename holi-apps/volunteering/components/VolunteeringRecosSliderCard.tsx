import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import RecoSliderCard from '@holi/core/components/RecoSliderCard'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Globe } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'

import { VolunteeringLabels } from '@holi-apps/volunteering/components/VolunteeringLabels'
import type { VolunteeringEngagement, VolunteeringReco } from '@holi-apps/volunteering/types'
import { Text } from 'holi-bricks/components/text'

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

  const title = engagement?.organizer?.name
    ? t('volunteering:engagement.title', {
        title: engagement.title,
        organization: engagement.organizer?.name,
        interpolation: { escapeValue: false },
      })
    : (engagement.title as string)

  const hasTopics = isReco
    ? engagementOrReco.matchedTopicsV2 && engagementOrReco.matchedTopicsV2?.length > 0
    : engagement?.topicsV2 && engagement?.topicsV2?.length > 0

  const hasSkills = isReco
    ? engagementOrReco.matchedSkillsV2 && engagementOrReco.matchedSkillsV2?.length > 0
    : engagement?.skillsV2 && engagement?.skillsV2?.length > 0

  return (
    <RecoSliderCard
      name="volunteering"
      to={`/volunteering/${engagement?.id}`}
      labels={
        (hasTopics || hasSkills) && (
          <>
            <VolunteeringLabels
              displayAll={false}
              topicSlugs={isReco ? engagementOrReco.matchedTopicsV2 : engagement?.topicsV2}
              skillSlugs={isReco ? engagementOrReco.matchedSkillsV2 : engagement?.skillsV2}
            />
            <HoliGap size={'xs'} />
          </>
        )
      }
      title={title}
      imageSourceUri={engagement?.imageUrl}
      footer={
        !!engagement?.location && (
          <View style={styles.locationFooter}>
            <HoliIcon icon={Globe} testID={'volunteering-reco-slider-card-location-icon'} />
            <Text size="sm">{engagement?.location}</Text>
          </View>
        )
      }
      trackingEvent={TrackingEvent.RecommendationPressed('volunteering_opportunity', engagement?.id as string, index)}
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
