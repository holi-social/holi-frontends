import React from 'react'
import RecoSlider from '@holi/core/components/RecoSlider'
import { CalendarEventFilled } from '@holi/icons/src/generated'
import { useTranslation } from 'react-i18next'
import EventCard from '@holi-apps/events/components/EventCard'
import { useNearbyEventsQuery } from '@holi/api/graphql/graphql-codegen'
import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import { TrackingEvent } from '@holi/core/tracking'

type EventCarouselProps = {
  cardWidth: number
}

const EventCarousel = ({ cardWidth }: EventCarouselProps) => {
  const { t } = useTranslation()
  const user = useLoggedInUser()
  const { data } = useNearbyEventsQuery({
    variables: {
      geolocationId: user.user?.geolocationId,
    },
  })

  const events = data?.appEvents_nearbyEvents.data

  if (!events) return

  return (
    <RecoSlider
      name="events"
      renderItem={({ item }) => <EventCard event={item} maxCardWidth={cardWidth} />}
      data={events}
      loading={user.isLoading}
      icon={CalendarEventFilled}
      heading={t('act.events.title')}
      subline={t('act.events.subline')}
      seeAllPath="/events"
      seeMoreTrackingEvent={TrackingEvent.Events.seeAll}
    />
  )
}

export default EventCarousel
