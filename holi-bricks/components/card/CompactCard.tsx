import { HoliIcon } from '@holi/icons/src/HoliIcon'
/* eslint-disable no-restricted-imports */
import HoliCalendarIcon from '@holi/ui/components/molecules/HoliCalendarIcon'
import type { ChipLabel } from 'holi-bricks/components/chips'
import { TextLink } from 'holi-bricks/components/text'
import { BorderRadius } from 'holi-bricks/tokens'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslation } from 'react-i18next'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import React, { useRef, useState } from 'react'
import { Image, type ImageSource } from 'holi-bricks/components/image'
import { Stack } from 'holi-bricks/components/stack'
import { Text as RNText } from 'react-native'

export interface CompactCardProps {
  title: string
  subtitle?: string
  topLabel?: string
  topLabelIcon?: HoliIconType
  chips?: Array<typeof ChipLabel>
  imageSrc?: ImageSource
  startDate?: string
  maxWidth?: number
}

export const CompactCard = ({
  title,
  topLabel,
  subtitle,
  chips,
  topLabelIcon,
  imageSrc,
  startDate,
  maxWidth,
}: CompactCardProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()

  const date = startDate ? new Date(startDate) : undefined

  const [imageError, setImageError] = useState(false)
  const handleImageError = () => {
    setImageError(true)
  }

  const placeholderImages = [
    require('@holi/ui/assets/img/events/thumbnail-green.svg'),
    require('@holi/ui/assets/img/events/thumbnail-blue.svg'),
    require('@holi/ui/assets/img/events/thumbnail-purple.svg'),
    require('@holi/ui/assets/img/events/thumbnail-yellow.svg'),
    require('@holi/ui/assets/img/events/thumbnail-green-full.svg'),
    require('@holi/ui/assets/img/events/thumbnail-blue-full.svg'),
    require('@holi/ui/assets/img/events/thumbnail-purple-full.svg'),
    require('@holi/ui/assets/img/events/thumbnail-yellow-full.svg'),
  ]
  const randomPlaceholderImage = useRef(placeholderImages[Math.floor(Math.random() * placeholderImages.length)]).current
  return (
    <View style={styles.cardContainer(maxWidth)}>
      <Stack borderWidth={1} borderColor="support" borderStyle="solid" borderRadius="md">
        <Stack direction="row" padding="3xs" backgroundColor="container" borderRadius="md" gap="4xs">
          {/* Card Cover */}
          <Stack alignItems="center" justifyContent="center">
            {/* cover image */}
            <View style={styles.image}>
              <Image
                source={!imageError && imageSrc ? imageSrc : randomPlaceholderImage}
                height={120}
                width={90}
                alt={t('act.events.thumbnail.label')}
                onError={handleImageError}
                whiteOverlay
              />
            </View>

            {/* calendar icon */}
            {date && (
              <View style={[styles.calendarIconContainer, { transform: [{ translateX: -20 }, { translateY: -20 }] }]}>
                <HoliCalendarIcon day={date.getDate()} month={date.getMonth() + 1} size="small" colored={false} />
              </View>
            )}
          </Stack>

          {/* Card Body */}
          <Stack gap="3xs" padding="4xs" flexShrink={1}>
            <Stack gap="3xs" padding={{ left: '5xs' }}>
              <Stack direction="row" alignItems="center" gap="4xs">
                {topLabelIcon && <HoliIcon icon={topLabelIcon} color={styles.topIconColor.color} size={16} />}

                {/* <Text ellipsizeMode="tail" size="xs" numberOfLines={1} color="support">
                  {topLabel}
                </Text> */}
                <RNText numberOfLines={1} ellipsizeMode="tail" style={styles.labelText}>
                  {topLabel}
                </RNText>
              </Stack>

              <Stack gap="4xs">
                <TextLink ellipsizeMode="tail" size="sm" numberOfLines={2}>
                  {title}
                </TextLink>

                {/* <Text ellipsizeMode="tail" size="xs" numberOfLines={1} color="support">
                  {subtitle}
                </Text> */}
                <RNText numberOfLines={1} ellipsizeMode="tail" style={styles.labelText}>
                  {subtitle}
                </RNText>
              </Stack>
            </Stack>

            <Stack direction="row" wrap="wrap" gap="xxs" flexShrink={2}>
              {chips?.map((ChipLabel, index) => (
                <ChipLabel key={index} />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  topIconColor: {
    color: theme.colors.fill.support,
  },
  bottomIconColor: {
    color: theme.colors.fill.default,
  },
  image: {
    borderRadius: BorderRadius.xs,
    borderColor: theme.colors.border.default,
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
  },
  calendarIconContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
  },
  cardContainer: (maxWidth?: number) => ({
    maxWidth: maxWidth ?? undefined,
  }),
  labelText: {
    lineHeight: 16,
    color: theme.colors.fill.support,
    fontSize: 13,
    letterSpacing: 0.104,
  },
}))
