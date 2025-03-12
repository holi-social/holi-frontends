import React from 'react'

import { MapPin2Filled } from '@holi/icons/src/generated'
import { ChipLabel } from 'holi-bricks/components/chips'
import { useTranslation } from 'react-i18next'
import { View } from 'react-native'
import type { HoliEvent } from '@holi-apps/events/types'
import { CompactCard } from 'holi-bricks/components/card/CompactCard'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'

export interface EventProps {
  event: HoliEvent
}

const EventCard = ({ event }: EventProps) => {
  const { t } = useTranslation()

  const startDateObj = event.startDate ? new Date(event.startDate) : undefined
  const endDateObj = event.endDate ? new Date(event.endDate) : undefined

  const formattedDates = () => {
    const day = startDateObj ? startDateObj.getDate() : ''
    const weekday = startDateObj ? startDateObj.toLocaleDateString('en-EN', { weekday: 'short' }) : '' // todo: use german weekdays for german users
    const monthName = startDateObj ? startDateObj.toLocaleDateString('en-EN', { month: 'short' }) : '' // todo: use german months for german users
    const startTime = startDateObj
      ? startDateObj.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
      : ''
    const endTime = endDateObj ? endDateObj.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) : ''
    return `${weekday}, ${day} ${monthName} ∙ ${startTime} ${t('act.events.fromTo')} ${endTime}`
  }

  const label = event.location
    ? `${event.location.street} ${event.location.streetNo}, ${event.location.zipCode} ${event.location.city}`
    : ''
  const subtitle = `${t('act.events.createdBy')} ${event.organisationName}`
  const ChipComponent = () => (
    <ChipLabel color="mono" size="sm">
      {formattedDates()}
    </ChipLabel>
  )

  return (
    <View>
      <HoliLink href={`/events/${event.id}`} label={event.title}>
        <CompactCard
          title={event.title}
          topLabel={label}
          subtitle={subtitle}
          chips={[ChipComponent]}
          topLabelIcon={MapPin2Filled}
          imageSrc={event.imageUrl}
          startDate={startDateObj}
        />
      </HoliLink>
    </View>
  )
}

export default EventCard
