import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import type { AvatarProps } from 'holi-bricks/components/avatar'
import { ButtonIcon } from 'holi-bricks/components/button'
import type { ButtonVariant } from 'holi-bricks/components/button/helpers'
import type { ImageSource } from 'holi-bricks/components/image'
import { Stack } from 'holi-bricks/components/stack'
import { Text, TextLink } from 'holi-bricks/components/text'
import type React from 'react'
import { type DimensionValue, View } from 'react-native'
import { CompactCardImage } from 'holi-bricks/components/compactCard/CompactCardImage'
import { FooterChips } from 'holi-bricks/components/compactCard/footer/FooterChips'
import { FooterDate } from 'holi-bricks/components/compactCard/footer/FooterDate'
import { FooterProgressBar } from 'holi-bricks/components/compactCard/footer/FooterProgressBar'
import type { CompoundCompactCard } from 'holi-bricks/components/compactCard/types'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

export interface CompactCardProps {
  title: string
  subtitle?: string
  topLabel?: string
  topLabelIcon?: HoliIconType
  imageSrc?: ImageSource
  date?: string
  maxWidth?: DimensionValue
  fixedWidth?: DimensionValue
  topIcon?: HoliIconType
  bottomIcon?: HoliIconType
  buttonIcon?: HoliIconType
  avatar?: Pick<AvatarProps, 'initials' | 'label' | 'source'>
  buttonIconVariant?: Extract<ButtonVariant, 'primary' | 'secondary' | 'tertiary'>
  minHeight?: number
  children?: React.ReactNode
}

export const CompactCard = (({
  title,
  topLabel,
  subtitle,
  topLabelIcon,
  imageSrc,
  date: startDate,
  maxWidth,
  fixedWidth,
  topIcon,
  bottomIcon,
  avatar,
  buttonIcon,
  buttonIconVariant = 'tertiary',
  minHeight,
  children,
}: CompactCardProps) => {
  const date = startDate ? new Date(startDate) : undefined
  const { styles } = useStyles(stylesheet)

  return (
    <View style={styles.cardContainer(maxWidth, fixedWidth)}>
      <Stack
        direction="row"
        padding="3xs"
        backgroundColor="support"
        borderRadius="md"
        gap="4xs"
        borderWidth={1}
        borderColor="support"
        borderStyle="solid"
      >
        {/* Card Cover */}
        <CompactCardImage
          imageSrc={imageSrc}
          date={date}
          topIcon={topIcon}
          bottomIcon={bottomIcon}
          avatar={avatar}
          minHeight={minHeight}
        />

        {/* Card Body */}
        <Stack gap="3xs" padding={{ bottom: '3xs' }} flexShrink={1} justifyContent="space-between">
          <Stack gap="3xs" padding={{ right: '4xs', left: '4xs' }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
              {/* top row including label and buttonIcon */}
              <Stack direction="row" gap="4xs">
                {topLabelIcon && <HoliIcon icon={topLabelIcon} color="support" size={16} />}
                <Text numberOfLines={1} ellipsizeMode="tail" size="xs" color="support">
                  {topLabel}
                </Text>
              </Stack>
              {buttonIcon && (
                <ButtonIcon icon={buttonIcon} label="buttonIconLabel" size="sm" variant={buttonIconVariant} />
              )}
            </Stack>
            {/* titles */}
            <Stack gap="4xs">
              <TextLink ellipsizeMode="tail" size="sm" numberOfLines={2}>
                {title}
              </TextLink>

              <Text numberOfLines={1} ellipsizeMode="tail" size="sm" color="support">
                {subtitle}
              </Text>
            </Stack>
          </Stack>

          {/* bottom row */}
          <Stack padding={{ left: '4xs', right: '4xs' }} gap="3xs">
            {children}
          </Stack>
        </Stack>
      </Stack>
    </View>
  )
}) as CompoundCompactCard

CompactCard.FooterChips = FooterChips
CompactCard.FooterDate = FooterDate
CompactCard.FooterProgressBar = FooterProgressBar

const stylesheet = createStyleSheet(() => ({
  cardContainer: (maxWidth?: DimensionValue, width?: DimensionValue) => ({
    maxWidth: maxWidth ?? undefined,
    width: width ?? undefined,
  }),
}))
