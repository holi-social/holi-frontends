import { HoliIcon } from '@holi/icons/src/HoliIcon'
/* eslint-disable no-restricted-imports */
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
/* eslint-disable no-restricted-imports */
import HoliCalendarIcon from '@holi/ui/components/molecules/HoliCalendarIcon'
import type { ChipLabel } from 'holi-bricks/components/chips'
import CardContainer from 'holi-bricks/components/container/CardContainer'
import { Text, TextLink } from 'holi-bricks/components/text'
import { BorderRadius, Spacing } from 'holi-bricks/tokens'
import { View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useTranslation } from 'react-i18next'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import React from 'react'

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
    <View style={styles.compactCard}>
      <CardContainer hasBorder borderRadius={BorderRadius.md} flexDirection="row">
        {/* Card Cover */}
        {/* todo: resize image height dynamically */}
        {/* <HoliCardComponent.ImageContainer> */}
        <View style={styles.imageContainer}>
          <HoliLocalImage
            imageSource={require('@holi/ui/assets/img/events/thumbnail-green.svg')}
            label={t('act.events.thumbnail.label')}
            isSvg
            height={120}
            width={90}
            style={styles.image}
            resizeMode="stretch"
          />
          <View style={styles.calendarIcon}>
            <HoliCalendarIcon day={new Date().getDate()} month={new Date().getMonth() + 1} size="small" />
          </View>
        </View>
        {/* </HoliCardComponent.ImageContainer> */}

        {/* Card Body */}
        <View style={styles.cardBody}>
          <View style={styles.topInformation}>
            <View style={styles.topLabel}>
              {topLabelIcon && <HoliIcon icon={topLabelIcon} color={styles.topIconColor.color} size={16} />}

              <Text ellipsizeMode="tail" size="xs" numberOfLines={1} color="support">
                {topLabel}
              </Text>
            </View>

            <View style={styles.title}>
              <TextLink ellipsizeMode="tail" size="sm" numberOfLines={2}>
                {title}
              </TextLink>

              <Text ellipsizeMode="tail" size="xs" numberOfLines={1} color="support">
                {subtitle}
              </Text>
            </View>
          </View>

          <View style={styles.topLabel}>
            {bottomLabelIcon && <HoliIcon icon={bottomLabelIcon} color={styles.bottomIconColor.color} size={16} />}

            <Text ellipsizeMode="tail" size="xs" numberOfLines={1} color="default">
              {bottomLabel}
            </Text>
          </View>

          <View style={styles.chips}>
            {chips?.map((ChipLabel, index) => (
              <ChipLabel key={index} />
            ))}
          </View>
        </View>
      </CardContainer>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  compactCard: {
    minWidth: 343,
  },
  title: {
    gap: Spacing['4xs'],
  },
  topInformation: {
    gap: Spacing['3xs'],
    paddingLeft: Spacing['5xs'],
  },
  cardBody: {
    gap: Spacing['3xs'],
    padding: Spacing['4xs'],
    flex: 1,
    paddingBottom: Spacing.xxs,
  },
  topIconColor: {
    color: theme.colors.fill.support,
  },
  bottomIconColor: {
    color: theme.colors.fill.default,
  },
  topLabel: {
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

    flexGrow: 0,
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: Spacing['3xs'],
    marginBottom: Spacing['3xs'],
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing['xxs'],
  },
}))
