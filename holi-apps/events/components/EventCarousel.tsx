import React from 'react'
import RecoSlider from '@holi/core/components/RecoSlider'
import { CheckboxFilled } from '@holi/icons/src/generated'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import { View } from 'react-native'
import { useTranslation } from 'react-i18next'
import EventCard from '@holi-apps/events/components/EventCard'
import { Spacing } from 'holi-bricks/tokens'
import { tempData } from '@holi-apps/events/components/tempData'

type EventCarouselProps = {
  cardWidth: number
}

const EventCarousel = ({ cardWidth }: EventCarouselProps) => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)
  const events = tempData.events.data

  return (
    <RecoSlider
      name="events"
      renderItem={({ item }) => {
        return (
          <View style={[styles.cardContainer(cardWidth)]} testID={'tasks-reco-slider-card'}>
            <EventCard event={item} />
          </View>
        )
      }}
      data={events}
      icon={CheckboxFilled}
      heading={t('act.events.title')}
      subline={t('act.events.subline')}
      labelSeeMore={t('act.events.showAll')}
      seeAllPath="/events"
      cardWidth={cardWidth}
      size="sm"
    />
  )
}

export default EventCarousel

const stylesheet = createStyleSheet(() => ({
  cardContainer: (cardWidth: number) => ({
    marginRight: Spacing.xxs,
    width: cardWidth,
  }),
}))
