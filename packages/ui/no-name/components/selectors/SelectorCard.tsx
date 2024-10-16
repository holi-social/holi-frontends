import React, { useState } from 'react'
import { GestureResponderEvent, Pressable, View } from 'react-native'
import { createStyleSheet, useStyles } from 'react-native-unistyles'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { HoliIconType } from '@holi/icons/src/HoliIconType'
import HoliLocalImage from '@holi/ui/components/atoms/HoliLocalImage'
import { StaticImageData } from '@holi/ui/components/atoms/HoliLocalImage.shared'
import HoliText from '@holi/ui/components/atoms/HoliText'
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
import HoliSwitch from '@holi/ui/components/molecules/HoliSwitch'
import { BorderRadius } from '@holi/ui/foundations/BorderRadius'
import Spacing from '@holi/ui/foundations/Spacing'

export type FormControl = 'radio' | 'checkbox' | 'switch' | 'none'
export type SelectorSize = 'lg' | 'md'
export type Variant = 'detailed' | 'list'

export type SelectorCardProps = {
  value: string
  title: string
  description?: string
  image?: StaticImageData
  icon?: HoliIconType
  defaultSelected?: boolean
  disabled?: boolean
  size?: SelectorSize
  outlined?: boolean
  reverseOrder?: boolean
  formControl?: FormControl
  variant?: Variant
  onPress: (event: GestureResponderEvent) => void
}

export const SelectorCard = ({
  description,
  title,
  image,
  icon,
  defaultSelected = false,
  disabled = false,
  size = 'md',
  outlined = true,
  reverseOrder = false,
  formControl = 'radio',
  variant = 'detailed',
  onPress,
}: SelectorCardProps) => {
  const [selected, setSelected] = useState(defaultSelected)

  const { styles } = useStyles(stylesheet, { disabled, reverseOrder })
  const imageSize = size === 'lg' ? Spacing.xxl : Spacing.md

  const handlePress = (e: GestureResponderEvent) => {
    setSelected(!selected)
    onPress(e)
    return null
  }

  return (
    <Pressable
      onPress={(e) => handlePress(e)}
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
        <HoliText bold>{title}</HoliText>
        {description && variant === 'detailed' && (
          <HoliText size="small" style={styles.text}>
            {description}
          </HoliText>
        )}
      </View>
      <View style={styles.interactiveContainer(variant, description)} pointerEvents="none">
        {formControl === 'radio' && (
          <HoliCheckbox shape="round" checked={selected} autofocus={false} aria-label={title} />
        )}
        {formControl === 'checkbox' && <HoliCheckbox checked={selected} aria-label={title} />}
        {formControl === 'switch' && <HoliSwitch value={selected || false} size="small" />}
      </View>
    </Pressable>
  )
}

const stylesheet = createStyleSheet((theme) => ({
  selector: (hovered: boolean, pressed: boolean, selected: boolean, outlined: boolean) => {
    return {
      alignSelf: 'center',
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
      width: '100%',
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
