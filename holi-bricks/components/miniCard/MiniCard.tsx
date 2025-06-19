import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import type { AvatarProps } from 'holi-bricks/components/avatar'
import type { ButtonVariant } from 'holi-bricks/components/button/helpers'
import { Image, type MultiPlatformImageSource } from 'holi-bricks/components/image'
import { Stack } from 'holi-bricks/components/stack'
import { Text, TextLink } from 'holi-bricks/components/text'
import type React from 'react'
import { type DimensionValue, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'
import { useRef, useState } from 'react'
import { pickByHash } from 'holi-bricks/components/image/helpers'
import { BorderRadius, Spacing } from 'holi-bricks/foundations'
import { ChipLabel } from 'holi-bricks/components/chips'
import { placeholderImages } from 'holi-bricks/components/image/placeholderImages'

export interface MiniCardProps {
  title: string
  subtitle?: string
  chipLabel?: string
  bottomLabel?: string
  topLabelIcon?: HoliIconType
  imageSrc?: MultiPlatformImageSource
  date?: string
  maxWidth?: DimensionValue
  fixedWidth?: DimensionValue
  chipIcon?: HoliIconType
  chipCounterIcon?: HoliIconType
  chipCounter?: string
  buttonIcon?: HoliIconType
  topLabelRightIcon?: HoliIconType
  avatar?: Pick<AvatarProps, 'initials' | 'label' | 'source'>
  buttonIconVariant?: Extract<ButtonVariant, 'primary' | 'secondary' | 'tertiary'>
  minHeight?: number
  children?: React.ReactNode
  fullHeight?: boolean
  imageLabel?: string
  fallbackImageHashKey?: string
  bottomIconRight?: HoliIconType
  bottomIconLeft?: HoliIconType
}

export const MiniCard = ({
  title,
  chipLabel,
  bottomLabel,
  imageSrc,
  chipIcon,
  chipCounterIcon,
  chipCounter,
  imageLabel,
  fallbackImageHashKey,
  bottomIconRight,
  bottomIconLeft,
}: MiniCardProps) => {
  const { styles } = useStyles(stylesheet)
  const [imageError, setImageError] = useState(false)
  const randomPlaceholderImage = useRef(pickByHash(placeholderImages, fallbackImageHashKey ?? title)).current
  const handleImageError = () => {
    setImageError(true)
  }

  return (
    <View>
      <Stack
        direction="column"
        padding="3xs"
        backgroundColor="support"
        borderRadius="md"
        gap="3xs"
        borderWidth="sm"
        borderColor="support"
        borderStyle="solid"
        flex={1}
        width={146}
      >
        {/* Card Cover */}
        <Stack alignItems="center" justifyContent="center">
          <Stack borderColor="default" borderRadius="xs" borderStyle="solid" borderWidth="sm" overflow="hidden">
            <Image
              source={!imageError && imageSrc ? imageSrc : randomPlaceholderImage}
              width={130}
              height={130}
              alt={imageLabel || title}
              onError={handleImageError}
              resizeMode="cover"
            />
          </Stack>

          {/* on top of the image */}
          {(chipIcon || chipLabel) && (
            <View style={styles.topLeft}>
              <ChipLabel color="white" iconLeading={chipIcon} size="sm">
                {chipLabel}
              </ChipLabel>
            </View>
          )}
          {chipCounterIcon && (
            <View style={styles.bottomRight}>
              {chipCounter && (
                <Text color="support" size="xs">
                  {chipCounter}
                </Text>
              )}
              <HoliIcon icon={chipCounterIcon} color="support" size={16} />
            </View>
          )}
        </Stack>

        {/* Card Body */}
        <Stack gap="xs" padding="4xs" flex={1} justifyContent="space-between">
          {/* title */}
          <TextLink ellipsizeMode="tail" size="sm" numberOfLines={3} role="presentation">
            {title}
          </TextLink>

          {/* bottom row */}
          <Stack gap="3xs" direction="row" justifyContent="space-between">
            <Stack direction="row" gap="4xs" flexShrink={1}>
              {bottomIconLeft && <HoliIcon icon={bottomIconLeft} size={16} color="support" />}
              <Text numberOfLines={1} ellipsizeMode="tail" size="xs" color="support" selectable={false}>
                {bottomLabel}
              </Text>
            </Stack>
            {bottomIconRight && <HoliIcon icon={bottomIconRight} size={16} />}
          </Stack>
        </Stack>
      </Stack>
    </View>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  topLeft: {
    position: 'absolute',
    top: 4,
    left: 4,
  },
  bottomRight: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    borderRadius: BorderRadius.pill,
    padding: Spacing['4xs'],
    backgroundColor: theme.colors.bg.support,
    flexDirection: 'row',
    gap: Spacing['4xs'],
    paddingVertical: Spacing['4xs'],
    paddingHorizontal: Spacing['4xs'],
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    borderRadius: 6,
  },
}))
