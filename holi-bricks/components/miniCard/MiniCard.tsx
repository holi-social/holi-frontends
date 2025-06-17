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

export interface MiniCardProps {
  title: string
  subtitle?: string
  chipLabel?: string
  bottomLabel?: string
  bottomLabelRight?: string
  topLabelIcon?: HoliIconType
  imageSrc?: MultiPlatformImageSource
  date?: string
  maxWidth?: DimensionValue
  fixedWidth?: DimensionValue
  chipIcon?: HoliIconType
  bottomIcon?: HoliIconType
  buttonIcon?: HoliIconType
  topLabelRightIcon?: HoliIconType
  avatar?: Pick<AvatarProps, 'initials' | 'label' | 'source'>
  buttonIconVariant?: Extract<ButtonVariant, 'primary' | 'secondary' | 'tertiary'>
  minHeight?: number
  children?: React.ReactNode
  fullHeight?: boolean
  imageLabel: string
  fallbackImageHashKey?: string
  bottomIconRight?: HoliIconType
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

export const MiniCard = ({
  title,
  chipLabel,
  bottomLabel,
  bottomLabelRight,
  imageSrc,
  chipIcon,
  bottomIcon,
  imageLabel,
  fallbackImageHashKey,
  bottomIconRight,
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
          <Stack
            borderColor="default"
            borderRadius="xs"
            borderStyle="solid"
            borderWidth="sm"
            overflow="hidden"
            // width={130}
            // minHeight={minHeight}
            // {...(Platform.OS === 'web' ? { height: '100%' } : {})}
          >
            <Image
              source={!imageError && imageSrc ? imageSrc : randomPlaceholderImage}
              width={130}
              height={130}
              alt={imageLabel}
              onError={handleImageError}
              resizeMode="cover"
            />
          </Stack>

          {/* on top of the image */}
          {chipIcon && (
            <View style={styles.topLeft}>
              <ChipLabel color="white" iconLeading={chipIcon}>
                {chipLabel}
              </ChipLabel>
            </View>
          )}
          {bottomIcon && (
            <View style={styles.bottomRight}>
              {bottomLabelRight && (
                <Text color="support" size="xs">
                  {bottomLabelRight}
                </Text>
              )}
              <HoliIcon icon={bottomIcon} color="support" size={16} />
            </View>
          )}
        </Stack>

        {/* Card Body */}
        <Stack gap="xs" padding="4xs" flexShrink={1} justifyContent="space-between">
          {/* title */}
          <TextLink ellipsizeMode="tail" size="sm" numberOfLines={3} role="presentation">
            {title}
          </TextLink>

          {/* bottom row */}
          <Stack gap="3xs" direction="row" justifyContent="space-between">
            <Stack direction="row" gap="4xs">
              {bottomIcon && <HoliIcon icon={bottomIcon} size={16} />}
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
    // borderRadius: BorderRadius.pill,
    // padding: Spacing['4xs'],
    // backgroundColor: theme.colors.bg.support,
    // flexDirection: 'row',
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
    paddingRight: Spacing['4xs'],
    paddingLeft: Spacing['3xs'],
    // alignItems: 'center',
    // alignSelf: 'center',
    // alignContent: 'center',
  },
  bottomLeft: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    borderRadius: 6,
  },
}))
