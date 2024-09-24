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
import { VolunteeringEngagement, VolunteeringReco } from '@holi-apps/volunteering/types'

type VolunteeringUpdatesListProps = {
  engagements: VolunteeringEngagement[] | VolunteeringReco[]
  loading: boolean
  cardWidth: number
}

const recoLabels = (reco: VolunteeringReco) => {
  const hasTopics = reco.matchedTopics && reco.matchedTopics?.length > 0
  const hasSkills = reco.matchedSkills && reco.matchedSkills?.length > 0
  return (
    (hasTopics || hasSkills) && (
      <>
        <VolunteeringLabels displayAll={false} topicSlugs={reco.matchedTopics} skillSlugs={reco.matchedSkills} />
        <HoliGap size={'xs'} />
      </>
    )
  )
}

const VolunteeringUpdatesList: React.FC<VolunteeringUpdatesListProps> = ({ loading, engagements, cardWidth }) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])
  const variant = useVolunteeringVariant()

  const renderItem = ({ item, index }: { item: VolunteeringEngagement | VolunteeringReco; index: number }) => {
    const isReco = 'engagement' in item
    const engagement = isReco ? item.engagement : item
    const title = engagement.organizer?.name
      ? t('volunteering:engagement.title', {
          title: engagement.title,
          organization: engagement.organizer?.name,
          interpolation: { escapeValue: false },
        })
      : engagement.title

    const legacyLabels = variant !== 'recosV1' && !isReco && (
      <HoliText size={'small'} style={styles.categoryText} testID="volunteering-engagement-categories">
        {item.categories[0]}
      </HoliText>
    )

    const recosV1Labels = variant === 'recosV1' && isReco && recoLabels(item)

    return (
      <ActSliderItem
        name="volunteering"
        to={`/volunteering/${engagement.id}`}
        labels={variant === 'recosV1' ? recosV1Labels : legacyLabels}
        title={title}
        imageSourceUri={engagement.imageUrl}
        footer={
          !!engagement.location && (
            <View style={styles.locationFooter}>
              <HoliIcon icon={Globe} testID={'volunteering-updates-item-location-icon'} />
              <HoliText size="small">{engagement.location}</HoliText>
            </View>
          )
        }
        trackingEvent={TrackingEvent.RecommendationPressed('volunteering_opportunity', engagement.id, index)}
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
