/* eslint-disable no-restricted-imports */
// TODO: add components for holi bricks for the following imports
import { SelectionElementProps } from 'holi-bricks/components/selectors/Selector'
import { Text } from 'holi-bricks/components/text/Text'
import React from 'react'
import { GestureResponderEvent, Pressable, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import HoliSwitch from '@holi/ui/components/molecules/HoliSwitch'
import { BorderRadius } from '@holi/ui/foundations/BorderRadius'
// TODO: move Spacing to holi-bricks
import Spacing from '@holi/ui/foundations/Spacing'

export type SelectorCardInputType = 'radio' | 'checkbox' | 'switch' | 'none'
export type SelectorCardSize = 'lg' | 'md'
export type SelectorCardVariant = 'detailed' | 'list'

export type SelectorCardProps = {
  title: string
  description?: string
  image?: StaticImageData
  icon?: HoliIconType
  defaultSelected?: boolean
  disabled?: boolean
  size?: SelectorCardSize
  outlined?: boolean
  reverseOrder?: boolean
  inputType?: SelectorCardInputType
  variant?: SelectorCardVariant
  onPress?: (event: GestureResponderEvent) => void | Promise<void>
  selected?: boolean
} & SelectionElementProps

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
}: SelectorCardProps) => {
  const { styles } = useStyles(stylesheet, { disabled, reverseOrder })
  const imageSize = size === 'lg' ? Spacing.xxl : Spacing.md

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ hovered, pressed }) => [styles.selector(!!hovered, !disabled && !!pressed, selected, outlined)]}
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
        <Text size="lg">{title}</Text>
        {description && variant === 'detailed' && (
          <Text size="sm" color={styles.text.color}>
            {description}
          </Text>
        )}
      </View>
      <View style={styles.interactiveContainer(variant, description)} pointerEvents="none">
        {inputType === 'radio' && (
          <HoliCheckbox shape="round" checked={selected} autofocus={false} aria-label={title} />
        )}
        {inputType === 'checkbox' && <HoliCheckbox checked={selected} aria-label={title} />}
        {inputType === 'switch' && <HoliSwitch value={selected || false} size="small" />}
      </View>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  selector: (hovered: boolean, pressed: boolean, selected: boolean, outlined: boolean) => {
    return {
      flex: 1,
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
    gap: 4,
  },
  text: {
    color: theme.components.selector.text,
  },
}))
