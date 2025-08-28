import { StyleSheet } from 'react-native-unistyles'
import React from 'react'
import { type FlexStyle, type GestureResponderEvent, Pressable, View } from 'react-native'

import { BorderRadius, type LayoutProps, layoutStyle, Spacing } from 'holi-bricks/foundations'
import { accessibilityProps, type AccessibilityProps } from 'holi-bricks/foundations/accessibility'

// eslint-disable-next-line no-restricted-imports
import HoliCheckbox from '@holi/ui/components/molecules/HoliCheckbox'
// eslint-disable-next-line no-restricted-imports
import HoliSwitch, { type HoliSwitchSize } from '@holi/ui/components/molecules/HoliSwitch'
import { SelectorCardContent, type SelectorCardContentProps } from './SelectorCardContent'

export type SelectorCardInputType = 'radio' | 'checkbox' | 'switch' | 'none'

export type SelectorCardProps = AccessibilityProps &
  LayoutProps &
  SelectorCardContentProps & {
    onPress?: (event: GestureResponderEvent) => void | Promise<void>
    disabled?: boolean
    outlined?: boolean
    reverseOrder?: boolean
    inputType?: SelectorCardInputType
    selected?: boolean
    switchSize?: HoliSwitchSize
    alignItems?: FlexStyle['alignItems']
    testID?: string
  }

export const SelectorCard = ({
  description,
  title,
  imageSource,
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
  alignItems = 'center',
  testID,
  ...rest
}: SelectorCardProps) => {
  styles.useVariants({ disabled, reverseOrder })
  const isPressable = !!onPress

  return (
    <Pressable
      onPress={(e) => onPress?.(e)}
      disabled={disabled}
      {...accessibilityProps(rest)}
      style={(state) => {
        const hovered = 'hovered' in state ? state.hovered : false
        const pressed = 'pressed' in state ? state.pressed : false
        return [
          styles.selector(
            isPressable && !!hovered,
            isPressable && !disabled && !!pressed,
            selected,
            outlined,
            alignItems
          ),
          layoutStyle(rest),
        ]
      }}
      testID={testID}
    >
      <SelectorCardContent
        title={title}
        description={description}
        imageSource={imageSource}
        icon={icon}
        size={size}
        variant={variant}
      />

      {isPressable && (
        <View style={styles.interactiveContainer(variant, description)} pointerEvents="none">
          {inputType === 'radio' && (
            <HoliCheckbox shape="round" checked={selected} autofocus={false} aria-label={title} />
          )}
          {inputType === 'checkbox' && <HoliCheckbox checked={selected} aria-label={title} />}
          {inputType === 'switch' && <HoliSwitch value={selected || false} size={switchSize} />}
        </View>
      )}
    </Pressable>
  )
}

const styles = StyleSheet.create((theme) => ({
  selector: (
    hovered: boolean,
    pressed: boolean,
    selected: boolean,
    outlined: boolean,
    alignItems: FlexStyle['alignItems']
  ) => {
    return {
      alignSelf: 'stretch',
      minHeight: Spacing['3xl'],
      padding: Spacing.xxs,
      backgroundColor: theme.components.selector.backgroundColor,
      borderRadius: BorderRadius.sm,
      outlineStyle: 'solid',
      outlineWidth: pressed ? 3 : hovered ? 2 : outlined ? 1 : 1,
      outlineColor:
        selected || hovered || pressed
          ? theme.components.selector.selected.outlineColor
          : theme.components.selector.outlineColor,

      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems,
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
  interactiveContainer: (variant, description?: string) => {
    return {
      alignSelf: description && variant === 'detailed' ? 'flex-start' : 'center',
    }
  },
}))
