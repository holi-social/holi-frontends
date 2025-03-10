import React from 'react'
import RecoSlider from '@holi/core/components/RecoSlider'
import { CheckboxFilled } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'
import EventCard from '@holi-apps/events/components/EventCard'
import { tempData } from '@holi-apps/events/components/tempData'
import { Stack } from 'holi-bricks/components/stack'

type EventCarouselProps = {
  cardWidth: number
}

const EventCarousel = ({ cardWidth }: EventCarouselProps) => {
  const { t } = useTranslation()
  const events = tempData.events.data

  return (
    <RecoSlider
      name="events"
      renderItem={({ item }) => {
        return (
          <Stack margin={{ right: 'xxs' }} width={cardWidth}>
            <EventCard event={item} />
          </Stack>
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
