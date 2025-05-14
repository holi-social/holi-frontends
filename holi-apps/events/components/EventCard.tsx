import React from 'react'

import type { HoliEvent } from '@holi-apps/events/types'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { TrackingEvent } from '@holi/core/tracking'
import { MapPin2Filled } from '@holi/icons/src/generated'
import { CompactCard } from 'holi-bricks/components/compactCard'
import { useTranslation } from 'react-i18next'

export interface EventProps {
  event: HoliEvent
  maxCardWidth?: number
}

const EventCard = ({ event, maxCardWidth: cardWidth }: EventProps) => {
  const { t } = useTranslation()
  const location = event.isRemote ? 'Remote' : event.location ? event.location.city : ''
  const organisationName = `${t('act.events.createdBy')} ${event.organisationName}`

  return (
    <HoliLinkTracked
      href={`/events/${event.id}`}
      label={event.title}
      trackingEvent={TrackingEvent.Events.selected(event.id)}
      isFullHeight
    >
      <CompactCard
        title={event.title}
        topLabel={location}
        subtitle={organisationName}
        topLabelIcon={MapPin2Filled}
        imageSrc={event.imageUrl}
        date={event?.startDate}
        maxWidth={cardWidth}
        minHeight={131}
      >
        {event.startDate ? <CompactCard.FooterDate startDate={event.startDate} endDate={event.endDate} /> : undefined}
      </CompactCard>
    </HoliLinkTracked>
  )
}

export default EventCard
