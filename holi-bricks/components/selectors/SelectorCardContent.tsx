import type { AccessibilityProps } from 'holi-bricks/foundations/accessibility'
import { createStyleSheet } from 'holi-bricks/styles'
import { Spacing } from 'holi-bricks/foundations'
import React from 'react'
import { View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
import { Text } from 'holi-bricks/components/text/Text'
import { Stack } from 'holi-bricks/components/stack'
import { Image, type MultiPlatformImageSource } from 'holi-bricks/components/image'

export type SelectorCardInputType = 'radio' | 'checkbox' | 'switch' | 'none'
export type SelectorCardSize = 'lg' | 'lm' | 'md'
export type SelectorCardVariant = 'detailed' | 'list'

const imageSizes: Record<SelectorCardSize, number> = {
  lg: Spacing.xxl,
  lm: Spacing.xl,
  md: Spacing.md,
}

export type SelectorCardContentProps = AccessibilityProps & {
  title: string
  description?: string
  imageSource?: MultiPlatformImageSource
  icon?: HoliIconType
  size?: SelectorCardSize
  variant?: SelectorCardVariant
}

export const SelectorCardContent = ({
  title,
  description,
  imageSource,
  icon,
  size = 'md',
  variant = 'detailed',
}: SelectorCardContentProps) => {
  const imageSize = imageSizes[size]

  return (
    <>
      {imageSource && (
        <Stack margin={{ top: '4xs' }}>
          <Image source={imageSource} width={imageSize} height={imageSize} alt={title} resizeMode="contain" />
        </Stack>
      )}

      {!imageSource && icon && (
        <Stack margin={{ top: '4xs' }}>
          <View style={styles.imageContainer}>
            <HoliIcon size={imageSize} icon={icon} />
          </View>
        </Stack>
      )}

      <View style={styles.textContainer}>
        <Text size={size === 'lg' ? 'lg' : 'md'}>{title}</Text>
        {description && variant === 'detailed' && (
          <Text size="sm" colorOverride={styles.description.color}>
            {description}
          </Text>
        )}
      </View>
    </>
  )
}

const styles = createStyleSheet((theme) => ({
  imageContainer: {
    variants: {
      size: {
        lg: {
          alignItems: 'center',
          alignSelf: 'center',
        },
      },
    },
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing['3xs'],
  },
  description: {
    color: theme.components.selector.text,
  },
}))
