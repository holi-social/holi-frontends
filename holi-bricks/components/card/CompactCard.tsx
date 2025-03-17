import { HoliIcon } from '@holi/icons/src/HoliIcon'
/* eslint-disable no-restricted-imports */
import HoliCalendarIcon from '@holi/ui/components/molecules/HoliCalendarIcon'
import type { ChipLabel } from 'holi-bricks/components/chips'
import { Text, TextLink } from 'holi-bricks/components/text'
import { BorderRadius } from 'holi-bricks/tokens'
import { Platform, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslation } from 'react-i18next'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import React, { useState } from 'react'
import { Image, type ImageSource } from 'holi-bricks/components/image'
import { Stack } from 'holi-bricks/components/stack'

export interface CompactCardProps {
  title: string
  subtitle?: string
  topLabel?: string
  bottomLabel?: string
  topLabelIcon?: HoliIconType
  bottomLabelIcon?: HoliIconType
  chips?: Array<typeof ChipLabel>
  imageSrc?: ImageSource
  startDate?: Date
}

export const CompactCard = ({
  title,
  topLabel,
  bottomLabel,
  subtitle,
  chips,
  topLabelIcon,
  bottomLabelIcon,
  imageSrc,
  startDate,
}: CompactCardProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()

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
  const randomPlaceholderImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)]

  return (
    <Stack minWidth={310}>
      <Stack borderWidth={1} borderColor="support" borderStyle="solid" borderRadius="md">
        <Stack
          direction="row"
          padding="3xs"
          backgroundColor="container"
          justifyContent="space-between"
          borderRadius="md"
        >
          {/* Card Cover */}
          {/* todo: resize image height dynamically */}
          <Stack alignItems="center" justifyContent="center">
            {/* cover image */}
            <View style={styles.image}>
              <Image
                source={!imageError && imageSrc ? imageSrc : randomPlaceholderImage}
                height={120}
                width={90}
                alt={t('act.events.thumbnail.label')}
                onError={handleImageError}
              />
            </View>
            {/* calendar icon */}
            {startDate && (
              <View
                style={[
                  styles.calendarIconContainer,
                  Platform.OS == 'web' ? { transform: [{ translateX: -20 }, { translateY: -20 }] } : {}, // todo: check on mobile
                ]}
              >
                <HoliCalendarIcon
                  day={startDate.getDate()}
                  month={startDate.getMonth() + 1}
                  size="small"
                  colored={false}
                />
              </View>
            )}
          </Stack>

          {/* Card Body */}
          <Stack gap="3xs" padding="4xs" flex={1}>
            <Stack gap="3xs" padding={{ left: '5xs' }}>
              <Stack direction="row" alignItems="center" gap="4xs">
                {topLabelIcon && <HoliIcon icon={topLabelIcon} color={styles.topIconColor.color} size={16} />}

                <Text ellipsizeMode="tail" size="xs" numberOfLines={1} color="support">
                  {topLabel}
                </Text>
              </Stack>

              <Stack gap="4xs">
                <TextLink ellipsizeMode="tail" size="sm" numberOfLines={2}>
                  {title}
                </TextLink>

                <Text ellipsizeMode="tail" size="xs" numberOfLines={1} color="support">
                  {subtitle}
                </Text>
              </Stack>
            </Stack>

            {(bottomLabel || bottomLabelIcon) && (
              <Stack direction="row" alignItems="center" gap="4xs">
                {bottomLabelIcon && <HoliIcon icon={bottomLabelIcon} color={styles.bottomIconColor.color} size={16} />}

                <Text ellipsizeMode="tail" size="xs" numberOfLines={1} color="default">
                  {bottomLabel}
                </Text>
              </Stack>
            )}

            <Stack direction="row" wrap="wrap" gap="xxs">
              {chips?.map((ChipLabel, index) => (
                <ChipLabel key={index} />
              ))}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
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
}))
