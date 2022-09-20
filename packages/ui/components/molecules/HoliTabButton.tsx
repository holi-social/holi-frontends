import React from 'react'
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

export type HoliTabButtonProps = {
  label: string
  id?: string
  style?: (ViewStyle | Record<string, unknown>) | (ViewStyle | Record<string, unknown>)[]
  disabled?: boolean // TODO(SF) keep?
  disableFocusability?: boolean // TODO(SF) keep?
  accessibilitySelected?: boolean
  accessibilityControls?: string
  testID?: string
  onPress?: null | ((event: GestureResponderEvent) => void)
}

const HoliTabButton: React.FC<HoliTabButtonProps> = ({
  disabled = false,
  disableFocusability = false,
  accessibilitySelected = false,
  accessibilityControls,
  ...props
}: React.PropsWithChildren<HoliTabButtonProps>) => {
  const accessibilityProps: AccessibilityProps & AccessibilityPropsWeb = {
    ...(Platform.OS === 'web' ? { focusable: !disableFocusability } : { accessible: !disableFocusability }),
    accessibilityRole: 'tab',
    accessibilityLabel: props.label,
    accessibilityControls,
    accessibilitySelected,
  }

  const content =
    typeof props.children === 'string' ? (
      <HoliText style={disabled ? styles.textDisabled : {}} size={'large'} bold={true} selectable={false}>
        {props.children}
      </HoliText>
    ) : (
      props.children
    )

  return (
    <Pressable
      {...accessibilityProps}
      nativeID={props.id}
      testID={props.testID}
      disabled={disabled}
      onPress={(event) => {
        !disabled && props.onPress && props.onPress(event)
      }}
      style={[props.style, styles.base]}
    >
      <View pointerEvents="none">{content}</View>
    </Pressable>
  )
}

export default HoliTabButton

const styles = StyleSheet.create({
  base: {
    ...Platform.select({
      web: {
        display: 'inline-block',
      },
    }),
    width: 'auto',
  },
  textDisabled: {
    color: colors.fontColorGrey,
  },
})
