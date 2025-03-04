import React from 'react'

import type { PropsWithSkeleton } from '@holi/ui/components/types'
import Skeleton from '@holi/core/screens/spaces/tasks/components/SpaceTaskTile/components/Skeleton'
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
import type { Space, Task } from '@holi/core/screens/spaces/types'
import { View } from 'react-native'
import { HoliLink } from '@holi/core/navigation/components/HoliLink'

export interface EventProps {
  task: Task
  space: Space
}

const EventRecommendation = ({
  loading,
  task, // todo: change to event
  space,
}: PropsWithSkeleton<EventProps>) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()
  if (loading) {
    return <Skeleton />
  }

  return (
    <HoliLink href={`/spaces/${space.name}/tasks/${task.id}`} label={task.name} isFullHeight>
      <CardContainer hasBorder borderRadius={BorderRadius.md} flexDirection="row">
        <HoliCardComponent.ImageContainer>
          <View style={styles.imageContainer}>
            <HoliLocalImage
              imageSource={require('@holi/ui/assets/img/events/thumbnail-green.svg')}
              label={t('spaces.tasks.thumbnail.label')}
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

              <Text ellipsizeMode="tail" size="xs" numberOfLines={2} testID="event-title" color="support">
                Lenbachstraße 22
                {/* todo: {event.location} */}
              </Text>
            </View>

            <View style={styles.title}>
              <TextLink ellipsizeMode="tail" size="sm" numberOfLines={2}>
                Inforveranstaltung der Hamburger Energielotsen
                {/* todo: {event.name} */}
              </TextLink>

              <Text ellipsizeMode="tail" size="xs" numberOfLines={2} testID="event-title" color="support">
                {t('act.events.createdBy')} Some Nice Org
                {/* todo: {event.location} */}
              </Text>
            </View>
          </View>

          <ChipLabel color="yellow" size="sm">
            Fri, 24 Apr ∙ 16:00 to 18:00
            {/* todo: {format(event.date.day)} ∙ {event.date.startTime} to {event.date.endTime} */}
          </ChipLabel>
        </View>
      </CardContainer>
    </HoliLink>
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

export default EventRecommendation
