import React, { useMemo } from 'react'
import {
  AccessibilityProps,
  GestureResponderEvent,
  Platform,
  Pressable,
  PressableProps,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'

import { HoliIcon } from '@holi/icons/src/HoliIcon'
import { Add, Check } from '@holi/icons/src/generated'
import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type ChipProps = PressableProps & {
  text?: string
  label: string
  checked?: boolean
  disabled?: boolean
  hideIcon?: boolean
  onPress?: (event: GestureResponderEvent) => void
  style?: ViewStyle | ViewStyle[]
  fontStyle?: TextStyle
  numberOfLines?: number
  testID?: string
}

const HoliChip: React.FunctionComponent<ChipProps> = ({
  text,
  label,
  checked = false,
  disabled = false,
  hideIcon = false,
  onPress = () => null,
  style,
  fontStyle,
  numberOfLines,
  testID,
}: ChipProps) => {
  const { theme } = useTheme()
  const { colors } = theme
  const styles = useMemo(() => getStyles(checked, theme), [theme])

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: !disabled,
    role: !disabled ? 'checkbox' : 'none',
    'aria-label': label,
    ...(!disabled
      ? {
          // since this component gets rerendered on every state change, we don't need an internal state, but can use the checked prop
          accessibilityState: { checked },
          'aria-checked': checked,
        }
      : {}),
  }

  return (
    <View
      style={[styles.chipContent, styles.holiChip, style, checked && styles.checked]}
      {...(testID ? { testID } : {})}
    >
      <Pressable
        {...accessibilityProps}
        {...(disabled ? { disabled } : {})}
        onPress={(e) => onPress?.(e)}
        style={({ focused, hovered, pressed }) => [
          styles.pressable,
          !disabled && focused && styles.focused,
          !disabled && hovered && styles.hovered,
          !disabled && pressed && styles.pressed,
        ]}
      >
        {/* Arrow function to pass Pressable states to its children */}
        {({ hovered }) => (
          <>
            <HoliText
              numberOfLines={numberOfLines}
              selectable={false}
              style={[styles.text, fontStyle || {}, (hovered && styles.hoveredText) || {}]}
            >
              {text}
            </HoliText>
            {!disabled && !hideIcon && (
              <View style={styles.iconView}>
                <HoliIcon
                  icon={checked ? Check : Add}
                  size={15}
                  color={checked ? colors.background10 : colors.foreground20}
                />
              </View>
            )}
          </>
        )}
      </Pressable>
    </View>
  )
}

export default HoliChip

const getStyles = (checked = false, theme: HoliTheme) =>
  StyleSheet.create({
    holiChip: {
      borderRadius: 8,
      backgroundColor: theme.colors.background20,
      alignSelf: 'flex-start',
      overflow: 'hidden',
      ...Platform.select({
        web: {
          display: 'inline-block',
        },
      }),
    },
    chipContent: {
      maxWidth: '100%',
    },
    pressable: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 40,
    },
    text: {
      fontWeight: '400',
      fontSize: 14,
      color: checked ? theme.colors.background10 : theme.colors.foreground20,
      lineHeight: 24,
    },
    iconView: {
      marginLeft: 1.5,
    },
    hovered: {
      backgroundColor: checked ? theme.colors.brandColorB20 : theme.colors.background30,
    },
    hoveredText: {
      color: checked ? theme.colors.background10 : theme.colors.brandColorB30,
    },
    focused: {
      outlineColor: theme.colors.brandColorB30,
      borderRadius: 8,
      ...Platform.select({
        web: {
          boxShadow: `0px 0px 0.7px 0.7px ${checked ? theme.colors.brandColorB30 : theme.colors.background20}`,
        },
      }),
    },
    pressed: {
      backgroundColor: checked ? theme.colors.brandColorB10 : theme.colors.background20,
    },
    checked: {
      backgroundColor: theme.colors.brandColorB30,
      borderRadius: 24,
    },
  })
