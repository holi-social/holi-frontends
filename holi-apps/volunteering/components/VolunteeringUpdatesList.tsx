import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'

import ActSlider from '@holi/core/screens/appsHub/components/ActSlider'
import ActSliderItem from '@holi/core/screens/appsHub/components/ActSliderItem'
import { TrackingEvent } from '@holi/core/tracking'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Globe, HeartsFilled } from '@holi/icons/src/generated'
import { HoliGap } from '@holi/ui/components/atoms/HoliGap'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

import { VolunteeringLabels } from '@holi-apps/volunteering/components/VolunteeringLabels'
import { useVolunteeringVariant } from '@holi-apps/volunteering/hooks/useVolunteeringVariant'
import { VolunteeringEngagement } from '@holi-apps/volunteering/types'

type VolunteeringUpdatesListProps = {
  engagements: VolunteeringEngagement[]
  loading: boolean
  cardWidth: number
}

const VolunteeringUpdatesList: React.FC<VolunteeringUpdatesListProps> = ({ loading, engagements, cardWidth }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const variant = useVolunteeringVariant()

  const renderItem = ({ item, index }: { item: VolunteeringEngagement; index: number }) => {
    const { organizer } = item
    const title = organizer?.name
      ? t('volunteering:engagement.title', {
          title: item.title,
          organization: organizer?.name,
          interpolation: { escapeValue: false },
        })
      : item.title

    const hasTopics = item.matchedTopics && item.matchedTopics?.length > 0
    const hasSkills = item.matchedSkills && item.matchedSkills?.length > 0

    const legacyLabels = variant !== 'recosV1' && (
      <HoliText size={'small'} style={styles.categoryText} testID="volunteering-engagement-categories">
        {item.categories[0]}
      </HoliText>
    )

    const recosV1Labels = variant === 'recosV1' && (hasTopics || hasSkills) && (
      <>
        <VolunteeringLabels displayAll={false} topicSlugs={item.matchedTopics} skillSlugs={item.matchedSkills} />
        <HoliGap size={'xs'} />
      </>
    )

    return (
      <ActSliderItem
        name="volunteering"
        to={`/volunteering/${item.id}`}
        labels={variant === 'recosV1' ? recosV1Labels : legacyLabels}
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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
    locationFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    categoryText: {
      color: theme.colors.brandColorB30,
    },
  })

export default VolunteeringUpdatesList
