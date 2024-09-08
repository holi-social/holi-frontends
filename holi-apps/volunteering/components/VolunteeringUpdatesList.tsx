import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import { HOLI_APPS, HOLI_APPS_NAVIGATION_PATHS } from '@holi/core/constants/appConstants'
import { Skill, Topic } from '@holi/core/domain/shared/types'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import AppUpdatesItem from '@holi/core/screens/appsHub/components/AppUpdatesItem'
import AppUpdatesList from '@holi/core/screens/appsHub/components/AppUpdatesList'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Globe, HeartsFilled } from '@holi/icons/src/generated'
import HoliText from '@holi/ui/components/atoms/HoliText'

import { labelsForListings } from '@holi-apps/volunteering/helpers'
import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

type VolunteeringUpdatesListProps = {
  style?: StyleProp<ViewStyle>
  engagements: VolunteeringEngagement[]
  loading: boolean
  cardWidth: number
  topics: readonly Topic[]
  skills: readonly Skill[]
}

const VolunteeringUpdatesList: React.FC<VolunteeringUpdatesListProps> = ({
  style,
  loading,
  engagements,
  cardWidth,
  topics,
  skills,
}) => {
  const { t } = useTranslation()
  const { navigate } = useRouting()

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
      <AppUpdatesItem
        appName={HOLI_APPS.VOLUNTEERING}
        to={`${HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.VOLUNTEERING].path}/${item.id}`}
        topicLabel={topicLabel}
        topicLabelCount={topicLabelCount}
        skillLabel={skillLabel}
        skillLabelCount={skillLabelCount}
        title={title}
        imageSourceUri={item.imageUrl}
        footer={
          !!item.location && (
            <View style={styles.locationFooter}>
              <HoliIcon icon={Globe} testID={`${HOLI_APPS.VOLUNTEERING}-updates-item-location-icon`} />
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
    <AppUpdatesList
      appName={HOLI_APPS.VOLUNTEERING}
      renderItem={renderItem}
      data={engagements}
      appIcon={HeartsFilled}
      heading={t('volunteering:app.name')}
      subline={t('volunteering:app.subline')}
      onPressSeeMore={() => navigate(HOLI_APPS_NAVIGATION_PATHS[HOLI_APPS.VOLUNTEERING].path)}
      labelSeeMore={t('volunteering:listing.loadMoreButton.text')}
      loading={loading}
      style={style}
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
