import React from 'react'
import RecoSlider from '@holi/core/components/RecoSlider'
import { CheckboxFilled } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'
import EventCard from '@holi-apps/events/components/EventCard'
import { Stack } from 'holi-bricks/components/stack'
import { useAllEventsQuery } from '@holi/api/graphql/graphql-codegen'

type EventCarouselProps = {
  cardWidth: number
}

const EventCarousel = ({ cardWidth }: EventCarouselProps) => {
  const { t } = useTranslation()
  const { data } = useAllEventsQuery({
    variables: { limit: 10, offset: 0 },
  })
  const events = data?.appEvents_events.data?.slice(0, 3)

  if (!events) return

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
