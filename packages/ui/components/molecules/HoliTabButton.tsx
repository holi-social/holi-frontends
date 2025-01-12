import React, { useMemo } from 'react'
import type { PropsWithChildren } from 'react'
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  Platform,
  Pressable,
  Role,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native'

import type { AccessibilityPropsWeb } from '@holi/ui/@types/reactNativeWeb'
import HoliText from '@holi/ui/components/atoms/HoliText'
import { HoliTheme, useTheme } from '@holi/ui/styles/theme'

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
    const { theme } = useTheme()
    const styles = useMemo(() => getStyles(theme), [theme])

    const accessibilityProps: AccessibilityPropsWeb & { role: Role } = {
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
          if (!disabled && props.onPress) props.onPress(event)
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

const getStyles = (theme: HoliTheme) =>
  StyleSheet.create({
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
      color: theme.colors.foreground20,
    },
  })

export default HoliTabButton
