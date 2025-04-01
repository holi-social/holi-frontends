import React from 'react'

import { MapPin2Filled } from '@holi/icons/src/generated'
import { ChipLabel } from 'holi-bricks/components/chips'
import { useTranslation } from 'react-i18next'
import type { HoliEvent } from '@holi-apps/events/types'
import { CompactCard } from 'holi-bricks/components/card/CompactCard'
import { HoliLinkTracked } from '@holi/core/components/Trackable'
import { useFormattedEventDates } from '@holi-apps/events/helpers/useFormattedEventDates'
import { TrackingEvent } from '@holi/core/tracking'
import { View } from 'react-native'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'

export interface EventProps {
  event: HoliEvent
  maxCardWidth?: number
}

const EventCard = ({ event, maxCardWidth: cardWidth }: EventProps) => {
  const { t } = useTranslation()
  const { styles } = useStyles(stylesheet)

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
      <View style={styles.overlay} />
    </HoliLinkTracked>
  )
}

export default EventCard

const stylesheet = createStyleSheet({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
})
