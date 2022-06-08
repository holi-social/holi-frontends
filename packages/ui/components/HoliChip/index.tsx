import * as React from 'react'
import {
  AccessibilityProps,
  GestureResponderEvent,
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native'
import tinycolor from 'tinycolor2'

import Holicon from '@holi/ui/components/holicon'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type ChipProps = PressableProps & {
  label: string
  checked?: boolean
  disabled?: boolean
  onPress?: null | ((event: GestureResponderEvent) => void)
}

const HoliChip: React.FunctionComponent<ChipProps> = (props: ChipProps) => {
  const { theme } = useTheme()
  const styles = getStyles(theme, props.checked)

  const contentText = typeof props.children === 'string' ? props.children : ''
  const accessibilityProps: AccessibilityProps & { accessibilityPressed?: boolean } = {
    accessibilityLabel: `${contentText} ${props.label}`,
    accessibilityRole: 'button',
    accessibilityPressed: props.checked,
  }

  return (
    <Pressable
      accessible={true}
      disabled={props.disabled}
      {...accessibilityProps}
      {...props}
      style={({ focused, hovered, pressed }) => [
        styles.holiChip,
        props.style as StyleProp<ViewStyle>,
        !props.disabled && props.checked && styles.checked,
        !props.disabled && focused && styles.focused,
        !props.disabled && hovered && styles.hovered,
        !props.disabled && pressed && styles.pressed,
      ]}
    >
      {/* Arrow function to pass Pressable states to its children */}
      {({ hovered }) => (
        <View style={styles.chipContent}>
          <Text selectable={false} style={[styles.text, hovered && styles.hoveredText]}>
            {contentText}
          </Text>
          {!props.disabled && (
            <View style={styles.iconView}>
              <Holicon
                color={props.checked ? theme.colors.fontColorWhite : theme.colors.fontColorGrey}
                icon={props.checked ? 'check' : 'plus'}
                size={theme.chip.iconSize}
              />
            </View>
          )}
        </View>
      )}
    </Pressable>
  )
}

export default HoliChip

const getStyles = (theme: HoliTheme, checked = false) =>
  StyleSheet.create({
    holiChip: {
      borderRadius: theme.chip.borderRadius,
      backgroundColor: theme.colors.backgroundColorGrey,
      paddingVertical: theme.chip.paddingVertical,
      paddingHorizontal: theme.chip.paddingHorizontal,
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
      alignItems: 'center', // vertical center
      justifyContent: 'center', // horizontal center
    },
    text: {
      fontWeight: '400',
      fontSize: theme.chip.fontSize,
      color: checked ? theme.colors.fontColorWhite : theme.colors.fontColorGrey,
      lineHeight: theme.chip.lineHeight,
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
      borderColor: theme.colors.secondaryColor,
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
      borderRadius: theme.chip.borderRadiusChecked,
    },
  })
