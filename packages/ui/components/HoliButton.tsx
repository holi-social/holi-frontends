import React, { ReactChild, ReactChildren } from 'react'
import {
  AccessibilityProps,
  GestureResponderEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import HoliText from '@holi/ui/components/HoliText'
import { HoliTextType } from '@holi/ui/components/HoliText/HoliText.types'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

export type ButtonProps = {
  label: string
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
  inline?: boolean
  type?: 'primary' | 'secondary'
  variant?: 'default' | 'small' | 'transparent'
  disabled?: boolean
  children?: ReactChild | ReactChild[] | ReactChildren | Array<ReactChild> | string
  disableFocusability?: boolean
  // only for TS (props are added by {...props})
  onPress?: null | ((event: GestureResponderEvent) => void)
  testID?: string
}

const HoliButton: React.FunctionComponent<ButtonProps> = ({
  label,
  inline = true,
  type = 'primary',
  variant = 'default',
  disabled = false,
  disableFocusability = false,
  ...props
}: ButtonProps) => {
  const isSmall = variant == 'small'
  const isTransparent = variant == 'transparent'
  const isPrimary = type === 'primary'

  const { theme } = useTheme()
  const styles = getStyles(theme, inline)

  const accessibilityProps: AccessibilityProps & { accessibilityPressed?: boolean } = {
    ...(Platform.OS === 'web' ? { focusable: !disableFocusability } : { accessible: !disableFocusability }),
    accessibilityRole: 'button',
    ...(label ? { accessibilityLabel: label } : {}),
  }
  const content =
    typeof props.children === 'string' ? (
      <HoliText
        styles={disabled ? styles.textDisabled : {}}
        type={isSmall ? HoliTextType.buttonSmall : HoliTextType.button}
        selectable={false}
      >
        {props.children}
      </HoliText>
    ) : (
      props.children
    )

  return (
    <Pressable
      {...accessibilityProps}
      {...props}
      disabled={disabled}
      onPress={(event) => {
        !disabled && props.onPress && props.onPress(event)
      }}
      style={(state) => {
        const result = [props.style, styles.base]
        if (!isTransparent) {
          result.push(styles.nonTransparent)
          if (isSmall) {
            result.push(styles.small)
          }
          if (disabled) {
            result.push(styles.disabled)
            isPrimary && result.push(styles.primaryDisabled)
          } else {
            isPrimary && result.push(styles.primary)
            if (state.pressed) {
              isPrimary && result.push(styles.pressedPrimary)
              !isPrimary && result.push(styles.pressedSecondary)
            } else {
              state.focused && result.push(styles.focused)
              state.hovered && result.push(styles.hovered)
            }
          }
        }
        return result
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} pointerEvents="none">
        {content}
      </View>
    </Pressable>
  )
}

export default HoliButton

const getStyles = (theme: HoliTheme, inline: boolean) =>
  StyleSheet.create({
    base: {
      ...Platform.select({
        web: {
          display: 'inline-block',
        },
      }),
      width: inline ? 'auto' : '100%',
    },
    nonTransparent: {
      borderColor: theme.colors.borderColorBlack,
      borderWidth: 2,
      borderRadius: 24,
      backgroundColor: theme.colors.backgroundColorWhite,
      paddingHorizontal: 32,
      paddingVertical: 13,
      margin: 4, // make the drop shadow not overlap onto other components
      elevation: 0,
      overflow: 'hidden',
    },
    textDisabled: {
      color: theme.colors.fontColorGrey,
    },
    hovered: {
      shadowColor: theme.colors.shadowColorBlack,
      shadowOffset: {
        width: 4,
        height: 4,
      },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 8,
    },
    focused: {
      borderWidth: 4,
      paddingHorizontal: 30,
      paddingVertical: 11,
    },
    pressedPrimary: {
      backgroundColor: theme.colors.backgroundColorYellowDark,
    },
    pressedSecondary: {
      backgroundColor: theme.colors.backgroundColorWhiteDark,
    },
    small: {
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 6,
    },
    textSmall: {
      fontSize: 14,
    },
    disabled: {
      borderColor: theme.colors.borderColorBlackDisabled,
    },
    primary: {
      backgroundColor: theme.colors.primaryColor,
    },
    primaryDisabled: {
      backgroundColor: theme.colors.backgroundColorGrey,
    },
  })
