import React from 'react'

import { Text, TextLink } from 'holi-bricks/components/text'
import { BorderRadius, Spacing } from 'holi-bricks/tokens'
import { useStyles } from 'holi-bricks/hooks'
import { createStyleSheet } from 'holi-bricks/utils'
import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { MapPin2Filled } from '@holi/icons/src/generated'
import { ChipLabel } from 'holi-bricks/components/chips'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { CardContainer } from 'holi-bricks/components/container/CardContainer'
import { useTranslation } from 'react-i18next'
import { HoliCardComponent } from '@holi/ui/components/molecules/HoliCard'
import HoliCalendarIcon from '@holi/ui/components/molecules/HoliCalendarIcon'
import { View } from 'react-native'
import type { HoliEvent } from '@holi-apps/events/types'

export interface EventProps {
  event: HoliEvent
}

const EventCard = ({ event }: EventProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()

  const format = (startDate: string, endDate: string) => {
    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)
    const day = startDateObj.getDate()
    const weekday = startDateObj.toLocaleDateString('en-EN', { weekday: 'short' }) // todo: use german weekdays for german users
    const monthName = startDateObj.toLocaleDateString('en-EN', { month: 'short' }) // todo: use german months for german users
    const startTime = startDateObj.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    const endTime = endDateObj.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
    return `${weekday}, ${day} ${monthName} ∙ ${startTime} ${t('act.events.fromTo')} ${endTime}`
  }

  return (
    // todo: <HoliLink href={`/events/${event.id}`} label={event.title} isFullHeight>
    <CardContainer hasBorder borderRadius={BorderRadius.md} flexDirection="row">
      <HoliCardComponent.ImageContainer>
        <View style={styles.imageContainer}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/events/thumbnail-green.svg')}
            label={t('act.events.thumbnail.label')}
            isSvg
            height={120}
            width={90}
            style={styles.image}
          />
        </View>
        <View style={styles.calendarIcon}>
          <HoliCalendarIcon day={new Date().getDate()} month={new Date().getMonth() + 1} size="small" />
          {/* todo: {event.date.day} */}
        </View>
      </HoliCardComponent.ImageContainer>

      <View style={styles.content}>
        <View style={styles.topInformation}>
          <View style={styles.location}>
            <HoliIcon icon={MapPin2Filled} color={styles.iconColor.color} size={16} />

            <Text ellipsizeMode="tail" size="xs" numberOfLines={1} testID="event-title" color="support">
              {event.location.street} {event.location.streetNo}, {event.location.zipCode} {event.location.city}
            </Text>
          </View>

          <View style={styles.title}>
            <TextLink ellipsizeMode="tail" size="sm" numberOfLines={2}>
              {event.title}
            </TextLink>

            <Text ellipsizeMode="tail" size="xs" numberOfLines={2} testID="event-title" color="support">
              {t('act.events.createdBy')} {event.organisationName}
            </Text>
          </View>
        </View>

        <ChipLabel color="mono" size="sm">
          {/* Fri, 24 Apr ∙ 16:00 to 18:00 */}
          {/* {event.startDate} */}
          {format(event.startDate, event.endDate)}
        </ChipLabel>
      </View>
    </CardContainer>
    // </HoliLink>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  title: {
    gap: Spacing['4xs'],
  },
  topInformation: {
    gap: Spacing['3xs'],
    paddingLeft: Spacing['5xs'],
  },
  content: {
    gap: Spacing.xxs,
    padding: Spacing['4xs'],
    flex: 1,
  },
  iconColor: {
    color: theme.colors.fill.support,
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing['4xs'],
  },
  image: {
    borderRadius: BorderRadius.xs,
    borderColor: theme.colors.border.default,
    overflow: 'hidden',
  },
  imageContainer: {
    backgroundColor: theme.colors.bg.container,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: 92,
    height: 128,
  },
  calendarIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
  },
}))

export default EventCard
