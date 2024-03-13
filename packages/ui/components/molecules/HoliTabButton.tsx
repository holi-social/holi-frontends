import React from 'react'
import type { PropsWithChildren } from 'react'
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { colors } from '@holi/ui/styles/globalVars'

interface Props {
  label: string
  id?: string
  style?: StyleProp<ViewStyle>
  disabled?: boolean
  disableFocusability?: boolean
  'aria-selected'?: boolean
  'aria-controls'?: string
  testID?: string
  onPress?: null | ((event: GestureResponderEvent) => void)
  onLayout?: (event: LayoutChangeEvent) => void
}

const HoliTabButton = React.forwardRef<View, PropsWithChildren<Props>>(
  (
    {
      disabled = false,
      disableFocusability = false,
      ['aria-selected']: ariaSelected = false,
      ['aria-controls']: accessibilityControls,
      ...props
    },
    ref
  ) => {
    const accessibilityProps: AccessibilityPropsWeb = {
      accessible: !disableFocusability,
      role: 'tab',
      'aria-label': props.label,
      'aria-controls': accessibilityControls,
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
        id={props.id}
        testID={props.testID}
        disabled={disabled}
        onPress={(event) => {
          !disabled && props.onPress && props.onPress(event)
        }}
        onLayout={props.onLayout}
        style={[props.style, styles.base]}
        ref={ref}
      >
        <View style={styles.content} testID={'tab-button-tab'}>
          {content}
        </View>
      </Pressable>
    )
  }
)

HoliTabButton.displayName = 'HoliTabButton'

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
    pointerEvents: 'none',
  },
  textDisabled: {
    color: colors.foreground20,
  },
})

export default HoliTabButton
