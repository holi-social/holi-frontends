import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import { Skill, Topic } from '@holi/core/domain/shared/types'
import ActSlider from '@holi/core/screens/appsHub/components/ActSlider'
import ActSliderItem from '@holi/core/screens/appsHub/components/ActSliderItem'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Globe, HeartsFilled } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'

import { labelsForListings } from '@holi-apps/volunteering/helpers'
import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

type VolunteeringUpdatesListProps = {
  engagements: VolunteeringEngagement[]
  loading: boolean
  cardWidth: number
  topics: readonly Topic[]
  skills: readonly Skill[]
}

const VolunteeringUpdatesList: React.FC<VolunteeringUpdatesListProps> = ({
  loading,
  engagements,
  cardWidth,
  topics,
  skills,
}) => {
  const { t } = useTranslation()

  const renderItem = ({ item, index }: { item: VolunteeringEngagement; index: number }) => {
    const { organizer } = item
    const title = organizer?.name
      ? t('volunteering:engagement.title', {
          title: item.title,
          organization: organizer?.name,
          interpolation: { escapeValue: false },
        })
      : item.title

    const { topicLabel, topicLabelCount, skillLabel, skillLabelCount } = labelsForListings(
      item.matchedTopics,
      item.matchedSkills,
      topics,
      skills
    )

    return (
      <ActSliderItem
        name="volunteering"
        to={`/volunteering/${item.id}`}
        topicLabel={topicLabel}
        topicLabelCount={topicLabelCount}
        skillLabel={skillLabel}
        skillLabelCount={skillLabelCount}
        title={title}
        imageSourceUri={item.imageUrl}
        footer={
          !!item.location && (
            <View style={styles.locationFooter}>
              <HoliIcon icon={Globe} testID={'volunteering-updates-item-location-icon'} />
              <HoliText size="small">{item.location}</HoliText>
            </View>
          )
        }
        trackingEvent={TrackingEvent.RecommendationPressed('volunteering_opportunity', item.id, index)}
        cardWidth={cardWidth}
      />
    )
  }

  return (
    <ActSlider
      name="volunteering"
      renderItem={renderItem}
      data={engagements}
      icon={HeartsFilled}
      heading={t('volunteering:app.name')}
      subline={t('volunteering:app.subline')}
      seeAllPath="/volunteering"
      labelSeeMore={t('volunteering:listing.loadMoreButton.text')}
      loading={loading}
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

export default VolunteeringUpdatesList
