import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import type { AvatarProps } from 'holi-bricks/components/avatar'
import { ButtonIcon } from 'holi-bricks/components/button'
import type { ButtonVariant } from 'holi-bricks/components/button/helpers'
import type { MultiPlatformImageSource } from 'holi-bricks/components/image'
import { Stack } from 'holi-bricks/components/stack'
import { Text, TextLink } from 'holi-bricks/components/text'
import type React from 'react'
import { type DimensionValue, Platform, View } from 'react-native'
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
  imageSrc?: MultiPlatformImageSource
  date?: string
  maxWidth?: DimensionValue
  fixedWidth?: DimensionValue
  topIcon?: HoliIconType
  bottomIcon?: HoliIconType
  buttonIcon?: HoliIconType
  topLabelRightIcon?: HoliIconType
  avatar?: Pick<AvatarProps, 'initials' | 'label' | 'source'>
  buttonIconVariant?: Extract<ButtonVariant, 'primary' | 'secondary' | 'tertiary'>
  minHeight?: number
  children?: React.ReactNode
  fullHeight?: boolean
  imageLabel: string
}

export const CompactCard = (({
  title,
  topLabel,
  subtitle,
  topLabelIcon,
  topLabelRightIcon,
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
  fullHeight,
  imageLabel,
}: CompactCardProps) => {
  const date = startDate ? new Date(startDate) : undefined
  const { styles } = useStyles(stylesheet)
  const hasTopLabel = topLabel || topLabelIcon || topLabelRightIcon || buttonIcon

  return (
    <View style={styles.cardContainer(maxWidth, fixedWidth, fullHeight)}>
      <Stack
        direction="row"
        padding="3xs"
        backgroundColor="support"
        borderRadius="md"
        gap="4xs"
        borderWidth="sm"
        borderColor="support"
        borderStyle="solid"
        flex={1}
      >
        {/* Card Cover */}
        <CompactCardImage
          imageSrc={imageSrc}
          date={date}
          topIcon={topIcon}
          bottomIcon={bottomIcon}
          avatar={avatar}
          minHeight={minHeight}
          imageLabel={imageLabel}
        />

        {/* Card Body */}
        <Stack gap="3xs" padding={{ bottom: '3xs' }} flexShrink={1} justifyContent="space-between" width="100%">
          <Stack gap="3xs" padding={{ right: '4xs', left: '4xs' }}>
            {hasTopLabel && (
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                {/* top row including label and buttonIcon */}
                <Stack direction="row" gap="4xs" justifyContent="space-between" flex={1}>
                  <Stack
                    direction="row"
                    gap="4xs"
                    flex={1}
                    margin={Platform.OS === 'web' ? undefined : { right: 'xs' }}
                  >
                    {topLabelIcon && <HoliIcon icon={topLabelIcon} color="support" size={16} />}
                    <Text numberOfLines={1} ellipsizeMode="tail" size="xs" color="support" selectable={false}>
                      {topLabel}
                    </Text>
                  </Stack>
                  {topLabelRightIcon && <HoliIcon icon={topLabelRightIcon} size={16} />}
                </Stack>
                {buttonIcon && (
                  <ButtonIcon icon={buttonIcon} label="buttonIconLabel" size="sm" variant={buttonIconVariant} />
                )}
              </Stack>
            )}
            {/* titles */}
            <Stack gap="4xs">
              <TextLink ellipsizeMode="tail" size="sm" numberOfLines={2} role="presentation">
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
  cardContainer: (maxWidth?: DimensionValue, width?: DimensionValue, fullHeight?: boolean) => ({
    maxWidth: maxWidth ?? '100%',
    width: width ?? undefined,
    height: fullHeight ? '100%' : undefined,
  }),
}))
