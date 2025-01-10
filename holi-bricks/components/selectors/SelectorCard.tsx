import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/accessibility'
import { useStyles } from 'holi-bricks/hooks'
import { BorderRadius, Spacing } from 'holi-bricks/tokens'
import { createStyleSheet } from 'holi-bricks/utils'
import React from 'react'
import { type GestureResponderEvent, Pressable, View } from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import type { HoliIconType } from '@holi/icons/src/HoliIconType'
// eslint-disable-next-line no-restricted-imports
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
// eslint-disable-next-line no-restricted-imports
import type { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import { Text } from 'holi-bricks/components/text/Text'
// eslint-disable-next-line no-restricted-imports
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
// eslint-disable-next-line no-restricted-imports
import HoliSwitch, { type HoliSwitchSize } from '@holi/ui/components/molecules/HoliSwitch'

export type SelectorCardInputType = 'radio' | 'checkbox' | 'switch' | 'none'
export type SelectorCardSize = 'lg' | 'md'
export type SelectorCardVariant = 'detailed' | 'list'

export type SelectorCardProps = AccessibilityProps & {
  title: string
  onPress?: (event: GestureResponderEvent) => void | Promise<void>
  description?: string
  image?: StaticImageData
  icon?: HoliIconType
  disabled?: boolean
  size?: SelectorCardSize
  outlined?: boolean
  reverseOrder?: boolean
  inputType?: SelectorCardInputType
  variant?: SelectorCardVariant
  selected?: boolean
  switchSize?: HoliSwitchSize
  testID?: string
}

export const SelectorCard = ({
  description,
  title,
  image,
  icon,
  disabled = false,
  size = 'md',
  outlined = true,
  reverseOrder = false,
  inputType = 'radio',
  variant = 'detailed',
  onPress,
  selected = false,
  switchSize = 'small',
  testID,
  ...rest
}: SelectorCardProps) => {
  const { styles } = useStyles(stylesheet, { disabled, reverseOrder })
  const imageSize = size === 'lg' ? Spacing.xxl : Spacing.md

  return (
    <Pressable
      onPress={(e) => onPress?.(e)}
      disabled={disabled}
      {...accessibilityProps(rest)}
      style={({ hovered, pressed }) => [styles.selector(!!hovered, !disabled && !!pressed, selected, outlined)]}
      testID={testID}
    >
      {image && (
        <HoliLocalImage
          imageSource={image}
          width={imageSize}
          height={imageSize}
          isSvg
          label={title}
          style={styles.imageContainer}
        />
      )}
      {!image && icon && (
        <View style={styles.imageContainer}>
          <HoliIcon size={imageSize} icon={icon} />
        </View>
      )}

      <View style={styles.textContainer}>
        <Text size={size === 'lg' ? 'lg' : 'md'}>{title}</Text>
        {description && variant === 'detailed' && (
          <Text size="sm" color={styles.description.color}>
            {description}
          </Text>
        )}
      </View>
      <View style={styles.interactiveContainer(variant, description)} pointerEvents="none">
        {inputType === 'radio' && (
          <HoliCheckbox shape="round" checked={selected} autofocus={false} aria-label={title} />
        )}
        {inputType === 'checkbox' && <HoliCheckbox checked={selected} aria-label={title} />}
        {inputType === 'switch' && <HoliSwitch value={selected || false} size={switchSize} />}
      </View>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  selector: (hovered: boolean, pressed: boolean, selected: boolean, outlined: boolean) => {
    return {
      alignSelf: 'stretch',
      minHeight: Spacing['3xl'],
      padding: Spacing.xxs,
      backgroundColor: theme.components.selector.backgroundColor,
      borderRadius: BorderRadius.sm,
      outlineStyle: 'solid',
      outlineWidth: pressed ? 3 : hovered ? 2 : outlined ? 1 : 0,
      outlineColor:
        selected || hovered || pressed
          ? theme.components.selector.selected.outlineColor
          : theme.components.selector.outlineColor,

      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: Spacing.xxs,
      variants: {
        disabled: {
          true: {
            opacity: 0.5,
          },
        },
        reverseOrder: {
          true: {
            flexDirection: 'row-reverse',
          },
        },
      },
    }
  },
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
  interactiveContainer: (variant, description?: string) => {
    return {
      alignSelf: description && variant === 'detailed' ? 'flex-start' : 'center',
    }
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
