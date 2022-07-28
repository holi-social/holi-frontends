import * as React from 'react'
import { useTranslation } from 'react-i18next'
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
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type ChipProps = PressableProps & {
  text: string
  label?: string
  checked?: boolean
  disabled?: boolean
  onPress?: null | ((event: GestureResponderEvent) => void)
  style?: ViewStyle | ViewStyle[]
  fontStyle?: TextStyle
}

const HoliChip: React.FunctionComponent<ChipProps> = (props: ChipProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme, props.checked, props.disabled)
  const { t } = useTranslation()

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    accessible: !props.disabled,
    accessibilityRole: !props.disabled ? 'checkbox' : 'none',
    ...(!props.disabled
      ? {
          // since this component gets rerendered on every state change, we don't need an internal state, but can use the checked prop
          accessibilityState: { checked: props.checked },
          // we need a label when not disabled, so we take the text as a default
          accessibilityLabel:
            props.label || t(props.checked ? 'chechbox.deselect' : 'chechbox.select', { label: props.text }),
        }
      : {}),
  }

  return (
    <Pressable
      {...accessibilityProps}
      {...props}
      style={({ focused, hovered, pressed }) => [
        styles.holiChip,
        props.style,
        !props.disabled && props.checked && styles.checked,
        !props.disabled && focused && styles.focused,
        !props.disabled && hovered && styles.hovered,
        !props.disabled && pressed && styles.pressed,
      ]}
    >
      {/* Arrow function to pass Pressable states to its children */}
      {({ hovered }) => (
        <View style={styles.chipContent}>
          <HoliText
            selectable={false}
            style={[styles.text, props.fontStyle || {}, (hovered && styles.hoveredText) || {}]}
          >
            {props.text}
          </HoliText>
          {!props.disabled && (
            <View style={styles.iconView}>
              <Holicon
                size={15}
                color={props.checked ? theme.colors.fontColorWhite : theme.colors.fontColorGrey}
                icon={props.checked ? 'check' : 'plus'}
              />
            </View>
          )}
        </View>
      )}
    </Pressable>
  )
}

export default HoliChip

const getStyles = (theme: HoliTheme, checked = false, disabled = false) =>
  StyleSheet.create({
    holiChip: {
      borderRadius: 8,
      backgroundColor: theme.colors.backgroundColorGrey,
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
      display: 'flex',
      flexDirection: 'row',
      alignSelf: 'center',
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontWeight: '400',
      fontSize: 14,
      color: checked && !disabled ? theme.colors.fontColorWhite : theme.colors.fontColorGrey,
      lineHeight: 24,
    },
    iconView: {
      marginLeft: 1.5,
    },
    hovered: {
      backgroundColor: tinycolor(checked ? theme.colors.secondaryColor : theme.colors.backgroundColorGrey)
        .darken(3)
        .toString(),
    },
    hoveredText: {
      color: checked ? theme.colors.fontColorWhite : theme.colors.secondaryColor,
    },
    focused: {
      outlineColor: theme.colors.secondaryColor,
      ...Platform.select({
        web: {
          boxShadow: `0px 0px 0.7px 0.7px ${checked ? theme.colors.secondaryColor : theme.colors.backgroundColorGrey}`,
        },
      }),
    },
    pressed: {
      backgroundColor: tinycolor(checked ? theme.colors.secondaryColor : theme.colors.backgroundColorGrey)
        .lighten(3)
        .toString(),
    },
    checked: {
      backgroundColor: theme.colors.secondaryColor,
      borderRadius: 24,
    },
  })
