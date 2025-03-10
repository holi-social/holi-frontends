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
import React from 'react'
import { Image } from 'holi-bricks/components/image'
import { Stack } from 'holi-bricks/components/stack'

export interface CompactCardProps {
  title: string
  subtitle?: string
  topLabel?: string
  bottomLabel?: string
  topLabelIcon?: HoliIconType
  bottomLabelIcon?: HoliIconType
  chips?: Array<typeof ChipLabel>
}

export const CompactCard = ({
  title,
  topLabel,
  bottomLabel,
  subtitle,
  chips,
  topLabelIcon,
  bottomLabelIcon,
}: CompactCardProps) => {
  const { styles } = useStyles(stylesheet)
  const { t } = useTranslation()

  return (
    <View style={styles.container}>
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
          <View style={styles.imageContainer}>
            {/* cover image */}
            <View style={styles.image}>
              <Image
                source={require('@holi/ui/assets/img/events/thumbnail-green.svg')}
                height={120}
                width={90}
                alt={t('act.events.thumbnail.label')}
              />
            </View>
            {/* calendar icon */}
            <View
              style={[
                styles.calendarIcon,
                Platform.OS == 'web' ? { transform: [{ translateX: -20 }, { translateY: -20 }] } : {}, // todo: check on mobile
              ]}
            >
              <HoliCalendarIcon day={new Date().getDate()} month={new Date().getMonth() + 1} size="small" />
            </View>
          </View>

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

            <Stack direction="row" alignItems="center" gap="4xs">
              {bottomLabelIcon && <HoliIcon icon={bottomLabelIcon} color={styles.bottomIconColor.color} size={16} />}

              <Text ellipsizeMode="tail" size="xs" numberOfLines={1} color="default">
                {bottomLabel}
              </Text>
            </Stack>

            <Stack direction="row" wrap="wrap" gap="xxs">
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
  container: {
    minWidth: 310,
  },
  topIconColor: {
    color: theme.colors.fill.support,
  },
  bottomIconColor: {
    color: theme.colors.fill.default,
  },
  image: {
    borderRadius: BorderRadius.xs,
    borderColor: theme.colors.border.default,
    overflow: 'hidden',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  calendarIcon: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    maxWidth: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 6,
  },
}))
