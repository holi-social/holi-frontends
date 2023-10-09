import React from 'react'
import type { PropsWithChildren } from 'react'
import { GestureResponderEvent, Platform, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

interface Props {
  label: string
  id?: string
  style: StyleProp<ViewStyle>
  disabled?: boolean
  disableFocusability?: boolean
  ariaSelected?: boolean
  accessibilityControls?: string
  testID?: string
  onPress?: null | ((event: GestureResponderEvent) => void)
}

const HoliTabButton = ({
  disabled = false,
  disableFocusability = false,
  ariaSelected = false,
  accessibilityControls,
  ...props
}: PropsWithChildren<Props>) => {
  const accessibilityProps: AccessibilityPropsWeb = {
    accessible: !disableFocusability,
    role: 'tab',
    'aria-label': props.label,
    accessibilityControls,
    'aria-selected': ariaSelected,
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
      <View pointerEvents="none" style={styles.content}>
        {content}
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  base: {
    ...Platform.select({
      web: {
        display: 'inline-block',
      },
    }),
    width: 'auto',
  },
  content: {
    flexDirection: 'row',
  },
  textDisabled: {
    color: colors.foreground20,
  },
})

export default HoliTabButton
