import React, { useCallback, useMemo } from 'react'
import {
  AccessibilityProps,
  GestureResponderEvent,
  Platform,
  Pressable,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

type HoliButtonType = 'primary' | 'secondary' // for working code completion in vscode
export const HoliButtonTypes: HoliButtonType[] = ['primary', 'secondary'] // keep in sync with all possible HoliButtonType values
type HoliButtonVariant = 'default' | 'small' // for working code completion in vscode
export const HoliButtonVariants: HoliButtonVariant[] = ['default', 'small'] // keep in sync with all possible HoliButtonVariant values

export type HoliButtonProps = {
  label: string
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
  inline?: boolean
  type?: HoliButtonType
  variant?: HoliButtonVariant
  transparent?: boolean
  disabled?: boolean
  disableFocusability?: boolean
  testID?: string
  onPress?: (event: React.SyntheticEvent | GestureResponderEvent) => void
}

const HoliButton: React.FC<HoliButtonProps> = ({
  inline = false,
  type = 'primary',
  variant = 'default',
  transparent = false,
  disabled = false,
  disableFocusability = false,
  ...props
}: React.PropsWithChildren<HoliButtonProps>) => {
  const isSmall = variant === 'small'
  const isPrimary = type === 'primary'

  const styles = useMemo(() => getStyles(inline), [inline])

  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    ...(Platform.OS === 'web' ? { focusable: !disableFocusability } : { accessible: !disableFocusability }),
    accessibilityRole: 'button',
    accessibilityLabel: props.label,
  }

  const content =
    typeof props.children === 'string' ? (
      <HoliText
        style={disabled ? styles.textDisabled : {}}
        size={isSmall ? 'small' : 'default'}
        bold={true}
        selectable={false}
      >
        {props.children}
      </HoliText>
    ) : (
      props.children
    )

  const onButtonPress = useCallback(
    (event: React.SyntheticEvent | GestureResponderEvent) => {
      if (props.onPress && !disabled) props.onPress(event)
    },
    [disabled, props]
  )

  return (
    <Pressable
      {...accessibilityProps}
      testID={props.testID}
      disabled={disabled}
      onPress={onButtonPress}
      style={(state) => {
        const result: ViewStyle[] = [styles.base]
        if (!transparent) {
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
        return [result, props.style]
      }}
    >
      <View
        style={{
          ...(!transparent ? { alignItems: 'center', flexDirection: 'row', justifyContent: 'center' } : {}),
        }}
        pointerEvents="none"
      >
        {content}
      </View>
    </Pressable>
  )
}

export default HoliButton

const getStyles = (inline: boolean) =>
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
      borderColor: colors.borderColorBlack,
      borderWidth: 2,
      borderRadius: 28,
      backgroundColor: colors.backgroundColorWhite,
      paddingHorizontal: 32,
      paddingVertical: 13,
      marginRight: 4, // make the drop shadow not overlap onto other components
      marginBottom: 4, // make the drop shadow not overlap onto other components
      elevation: 0,
      overflow: 'hidden',
    },
    textDisabled: {
      color: colors.fontColorGrey,
    },
    hovered: {
      shadowColor: colors.shadowColorBlack,
      shadowOffset: {
        width: 4,
        height: 4,
      },
      shadowOpacity: 1,
      shadowRadius: 0,
      elevation: 8,
    },
    focused: {
      outlineWidth: 2,
      outlineColor: colors.shadowColorBlack,
      outlineStyle: 'solid',
    },
    pressedPrimary: {
      backgroundColor: colors.backgroundColorYellowDark,
    },
    pressedSecondary: {
      backgroundColor: colors.backgroundColorGreyDark,
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
      borderColor: colors.borderColorBlackDisabled,
    },
    primary: {
      backgroundColor: colors.primaryColor,
    },
    primaryDisabled: {
      backgroundColor: colors.backgroundColorGrey,
    },
  })
