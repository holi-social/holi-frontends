import * as React from 'react'
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
import tinycolor from 'tinycolor2'

import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliText from '@holi/ui/components/atoms/HoliText'
import Holicon from '@holi/ui/components/holicon'
import { colors } from '@holi/ui/styles/globalVars'

export type ChipProps = PressableProps & {
  text?: string
  label?: string
  checked?: boolean
  disabled?: boolean
  hideIcon?: boolean
  onPress?: null | ((event: GestureResponderEvent) => void)
  style?: ViewStyle | ViewStyle[]
  fontStyle?: TextStyle
  numberOfLines?: number
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
}: ChipProps) => {
  const styles = getStyles(checked)

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: !disabled,
    accessibilityRole: !disabled ? 'checkbox' : 'none',
    ...(!disabled
      ? {
          // since this component gets rerendered on every state change, we don't need an internal state, but can use the checked prop
          accessibilityState: { checked },
          // we need a label when not disabled, so we take the text as a default
          accessibilityLabel: label || text,
        }
      : {}),
  }

  return (
    <View style={[styles.chipContent, styles.holiChip, style, checked && styles.checked]}>
      <Pressable
        {...accessibilityProps}
        {...(disabled ? { disabled } : {})}
        onPress={(e) => onPress && onPress(e)}
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
                <Holicon
                  size={15}
                  color={checked ? colors.fontColorWhite : colors.fontColorGrey}
                  icon={checked ? 'check' : 'plus'}
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

const getStyles = (checked = false) =>
  StyleSheet.create({
    holiChip: {
      borderRadius: 8,
      backgroundColor: colors.backgroundColorGrey,
      paddingVertical: 8,
      paddingHorizontal: 14,
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
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontWeight: '400',
      fontSize: 14,
      color: checked ? colors.fontColorWhite : colors.fontColorGrey,
      lineHeight: 24,
    },
    iconView: {
      marginLeft: 1.5,
    },
    hovered: {
      backgroundColor: tinycolor(checked ? colors.secondaryColor : colors.backgroundColorGrey)
        .darken(3)
        .toString(),
    },
    hoveredText: {
      color: checked ? colors.fontColorWhite : colors.secondaryColor,
    },
    focused: {
      outlineColor: colors.secondaryColor,
      ...Platform.select({
        web: {
          boxShadow: `0px 0px 0.7px 0.7px ${checked ? colors.secondaryColor : colors.backgroundColorGrey}`,
        },
      }),
    },
    pressed: {
      backgroundColor: tinycolor(checked ? colors.secondaryColor : colors.backgroundColorGrey)
        .lighten(3)
        .toString(),
    },
    checked: {
      backgroundColor: colors.secondaryColor,
      borderRadius: 24,
    },
  })
