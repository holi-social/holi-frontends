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
import { VolunteeringReco } from '@holi-apps/volunteering/types'

const VolunteeringRecosListItem = ({
  item: reco,
  index,
  cardWidth,
}: {
  item: VolunteeringReco
  index: number
  cardWidth: number
}) => {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const styles = useMemo(() => getStyles(theme), [theme])

  const title = reco.engagement.organizer?.name
    ? t('volunteering:engagement.title', {
        title: reco.engagement.title,
        organization: reco.engagement.organizer?.name,
        interpolation: { escapeValue: false },
      })
    : reco.engagement.title

  const hasTopics = reco.matchedTopics && reco.matchedTopics?.length > 0
  const hasSkills = reco.matchedSkills && reco.matchedSkills?.length > 0

  return (
    <ActSliderItem
      name="volunteering"
      to={`/volunteering/${reco.engagement.id}`}
      labels={
        (hasTopics || hasSkills) && (
          <>
            <VolunteeringLabels displayAll={false} topicSlugs={reco.matchedTopics} skillSlugs={reco.matchedSkills} />
            <HoliGap size={'xs'} />
          </>
        )
      }
      title={title}
      imageSourceUri={reco.engagement.imageUrl}
      footer={
        !!reco.engagement.location && (
          <View style={styles.locationFooter}>
            <HoliIcon icon={Globe} testID={'volunteering-updates-item-location-icon'} />
            <HoliText size="small">{reco.engagement.location}</HoliText>
          </View>
        )
      }
      trackingEvent={TrackingEvent.RecommendationPressed('volunteering_opportunity', reco.engagement.id, index)}
      cardWidth={cardWidth}
    />
  )
}

type VolunteeringRecosListProps = {
  recos: VolunteeringReco[]
  cardWidth: number
}

const VolunteeringRecosList: React.FC<VolunteeringRecosListProps> = ({ recos, cardWidth }) => {
  const { t } = useTranslation()

  return (
    <ActSlider
      name="volunteering"
      renderItem={(info) => <VolunteeringRecosListItem item={info.item} index={info.index} cardWidth={cardWidth} />}
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

export default VolunteeringRecosList
