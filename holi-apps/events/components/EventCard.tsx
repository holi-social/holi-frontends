import React from 'react'

import { MapPin2Filled } from '@holi/icons/src/generated'
import { ChipLabel } from 'holi-bricks/components/chips'
import { useTranslation } from 'react-i18next'
import type { HoliEvent } from '@holi-apps/events/types'
import { CompactCard } from 'holi-bricks/components/card/CompactCard'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { useFormattedEventDates } from '@holi-apps/events/helpers/useFormattedEventDates'
import { TrackingEvent } from '@holi/core/tracking'

export interface EventProps {
  event: HoliEvent
  maxCardWidth?: number
}

const EventCard = ({ event, maxCardWidth: cardWidth }: EventProps) => {
  const { t } = useTranslation()

  const formattedDates = useFormattedEventDates(event.startDate, event.endDate)

  const location = event.isRemote ? 'Remote' : event.location ? event.location.city : ''

  const organisationName = `${t('act.events.createdBy')} ${event.organisationName}`
  const ChipComponent = () => (
    <ChipLabel color="mono" size="sm">
      {event?.startDate && formattedDates}
    </ChipLabel>
  )

  return (
    <HoliLinkTracked
      href={`/events/${event.id}`}
      label={event.title}
      trackingEvent={TrackingEvent.Events.selected(event.id)}
    >
      <CompactCard
        title={event.title}
        topLabel={location}
        subtitle={organisationName}
        topLabelIcon={MapPin2Filled}
        imageSrc={event.imageUrl}
        startDate={event?.startDate}
        {...(event.startDate && { chips: [ChipComponent] })}
        maxWidth={cardWidth}
      />
    </HoliLinkTracked>
  )
}

export default EventCard
