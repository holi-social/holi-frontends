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

  const formattedDates = (startDate: Date, endDate?: Date) => {
    const startDay = startDate.getDate()
    const startWeekday = startDate.toLocaleDateString('en-EN', { weekday: 'short' }) // todo: use german weekdays for german users
    const startMonthName = startDate.toLocaleDateString('en-EN', { month: 'short' }) // todo: use german months for german users
    const startTime = startDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })

    if (!endDate || startDate?.getTime() === endDate?.getTime()) {
      return startTime === '00:00'
        ? `${startWeekday}, ${startDay} ${startMonthName}`
        : `${startWeekday}, ${startDay} ${startMonthName} ∙ ${startTime}`
    }

    const endDay = endDate.getDate()
    const endWeekday = endDate.toLocaleDateString('en-EN', { weekday: 'short' }) // todo: use german weekdays for german users
    const endMonthName = endDate.toLocaleDateString('en-EN', { month: 'short' }) // todo: use german months for german users
    const endTime = endDate.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })

    if (startDay !== endDay) {
      return `${startWeekday}, ${startDay} ${startMonthName} ${t('act.events.fromTo')} ${endWeekday}, ${endDay} ${endMonthName}`
    }

    return `${startWeekday}, ${startDay} ${startMonthName} ∙ ${startTime} ${t('act.events.fromTo')} ${endTime}`
  }

  const location = event.isRemote
    ? 'Remote'
    : event.location
      ? `${event.location.street} ${event.location.streetNo}, ${event.location.zipCode} ${event.location.city}`
      : ''

  const organisationName = `${t('act.events.createdBy')} ${event.organisationName}`
  const ChipComponent = () => (
    <ChipLabel color="mono" size="sm">
      {startDateObj && formattedDates(startDateObj, endDateObj)}
    </ChipLabel>
  )

  return (
    <View>
      <HoliLink href={`/events/${event.id}`} label={event.title}>
        <CompactCard
          title={event.title}
          topLabel={location}
          subtitle={organisationName}
          topLabelIcon={MapPin2Filled}
          imageSrc={event.imageUrl}
          startDate={startDateObj}
          {...(startDateObj && { chips: [ChipComponent] })}
        />
      </HoliLink>
    </View>
  )
}

export default EventCard
