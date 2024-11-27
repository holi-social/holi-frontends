import React, { type ReactNode, useRef, useCallback, useState } from 'react'
import {
  View,
  StatusBar,
  Platform,
  type ScrollViewProps,
  type KeyboardAvoidingViewProps,
  type ViewStyle,
  type StyleProp,
  type LayoutChangeEvent,
  type StatusBarProps,
} from 'react-native'
import { createStyleSheet } from 'holi-bricks/utils'
import { useBricks, useStyles } from 'holi-bricks/hooks'
import { KeyboardAvoidingView, KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useScrollToTop } from '@react-navigation/native'
import { useAutoPreset, type ScrollEnabledToggleThreshold } from '@holi/core/components/Screen/useAutoPreset'
import { SafeAreaView, type Edges } from 'react-native-safe-area-context'
import Spacing from '@holi/ui/foundations/Spacing'
import type { SpacingSize } from 'holi-bricks/tokens'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import Animated from 'react-native-reanimated'

type ScreenOuterSpacing = {
  top?: SpacingSize
  bottom?: SpacingSize
  left?: SpacingSize
  right?: SpacingSize
}

interface BaseScreenProps {
  /**
   * Background of the screen
   */
  backgroundColor?: string
  /**
   * The distance between keyboard and focused `TextInput` when keyboard is shown. Default is `0`.
   */
  keyboardBottomOffset?: number
  /**
   * Control status bar options. Note that status bar theme
   * is managed automatically
   */
  StatusBarProps?: StatusBarProps
  StickyBottomComponent?: ReactNode
  headerSpacing?: 'default' | 'none' | SpacingSize
  StickyTopComponent?: ReactNode
  /**
   * Safe areas object. Avoid using it if you are using preset scroll and enableScrollHeader is true
   * because the scroll header already manage it by default. This behavior must be changed in the future.
   */
  safeAreaEdges?: Edges
  /**
   * Distance between the top of the user screen and the React Native view. This
   * may be non-zero in some cases. Defaults to 0.
   */
  keyboardOffset?: number
  KeyboardAvoidingViewProps?: KeyboardAvoidingViewProps
  contentContainerStyle?: StyleProp<ViewStyle>
  style?: StyleProp<ViewStyle>
  /**
   * Spacing object { top, bottom, left, right } needed to add
   * spacing to the screen outer container. It uses padding.
   */
  spacing?: ScreenOuterSpacing
  children: ReactNode | ReactNode[]
  testID?: string
}

interface FixedScreenProps extends BaseScreenProps {
  preset?: 'fixed'
}

interface ScrollScreenProps extends BaseScreenProps {
  preset?: 'scroll'
  keyboardShouldPersistTaps?: 'handled' | 'always' | 'never'
  ScrollViewProps?: ScrollViewProps
  enableScrollHeader?: boolean
}

interface AutoScreenProps extends Omit<ScrollScreenProps, 'preset'> {
  preset?: 'auto'
  /**
   * Threshold to trigger the automatic disabling/enabling of scroll ability.
   * Defaults to `{ percent: 0.92 }`.
   */
  scrollEnabledToggleThreshold?: ScrollEnabledToggleThreshold
}

export type ScreenProps = ScrollScreenProps | FixedScreenProps | AutoScreenProps

type ScreenPreset = 'fixed' | 'scroll' | 'auto'

const isIos = Platform.OS === 'ios'
function isNonScrolling(preset?: ScreenPreset) {
  return !preset || preset === 'fixed'
}
export const DEFAULT_BOTTOM_OFFSET = 50

function ScreenWithScrolling(props: ScreenProps) {
  const {
    children,
    keyboardShouldPersistTaps = 'handled',
    keyboardBottomOffset = DEFAULT_BOTTOM_OFFSET,
    contentContainerStyle,
    ScrollViewProps,
    enableScrollHeader,
    style,
  } = props as ScrollScreenProps
  const { styles } = useStyles(stylesheet)
  const ref = useRef<Animated.ScrollView>(null)

  const { scrollEnabled, onContentSizeChange, onLayout } = useAutoPreset(props as AutoScreenProps)

  // Add native behavior of pressing the active tab to scroll to the top of the content
  // More info at: https://reactnavigation.org/docs/use-scroll-to-top/
  useScrollToTop(ref)

  const Container = enableScrollHeader ? ScrollHeaderLayout : Animated.createAnimatedComponent(KeyboardAwareScrollView)

  return (
    <Container
      bottomOffset={keyboardBottomOffset}
      {...{ keyboardShouldPersistTaps, scrollEnabled, ref }}
      {...ScrollViewProps}
      onLayout={(e) => {
        onLayout(e)
        ScrollViewProps?.onLayout?.(e)
      }}
      onContentSizeChange={(w: number, h: number) => {
        onContentSizeChange(w, h)
        ScrollViewProps?.onContentSizeChange?.(w, h)
      }}
      style={[styles.container, ScrollViewProps?.style, style]}
      contentContainerStyle={[styles.inner, ScrollViewProps?.contentContainerStyle, contentContainerStyle]}
    >
      {children}
    </Container>
  )
}

function ScreenWithoutScrolling({ children }: FixedScreenProps) {
  const { styles } = useStyles(stylesheet)
  return (
    <View style={styles.container}>
      <View style={[styles.inner]}>{children}</View>
    </View>
  )
}

export const Screen = (props: ScreenProps) => {
  const {
    preset = 'fixed',
    keyboardOffset,
    StatusBarProps,
    KeyboardAvoidingViewProps,
    backgroundColor,
    safeAreaEdges = [],
    StickyBottomComponent,
    StickyTopComponent,
    spacing,
    testID,
    ...otherProps
  } = props
  const { styles, theme } = useStyles(stylesheet)
  const [stickyBottomOffset, setStickyBottomOffset] = useState(0)
  const [stickyTopOffset, setStickyTopOffset] = useState(0)
  const { getActiveThemeName } = useBricks()
  const themeName = getActiveThemeName()
  const stickyBottomLayout = useCallback((e: LayoutChangeEvent) => {
    setStickyBottomOffset(e.nativeEvent.layout.height)
  }, [])
  const stickyTopLayout = useCallback((e: LayoutChangeEvent) => {
    setStickyTopOffset(e.nativeEvent.layout.height)
  }, [])

  return (
    <SafeAreaView
      edges={safeAreaEdges}
      mode="padding"
      testID={testID}
      style={[
        styles.spacing(spacing),
        styles.container,
        styles.relative,
        { backgroundColor: backgroundColor || theme.colors.background },
      ]}
    >
      <StatusBar {...StatusBarProps} barStyle={themeName === 'dark' ? 'light-content' : 'dark-content'} />

      <KeyboardAvoidingView
        behavior={isIos ? 'padding' : 'height'}
        keyboardVerticalOffset={keyboardOffset}
        {...KeyboardAvoidingViewProps}
        style={[
          styles.full,
          KeyboardAvoidingViewProps?.style,
          styles.relative,
          StickyBottomComponent ? styles.stickyBottomOffset(stickyBottomOffset) : null,
          StickyTopComponent ? styles.stickyTopOffset(stickyTopOffset) : null,
        ]}
      >
        {StickyTopComponent && (
          <View style={styles.stickyTop} onLayout={stickyTopLayout}>
            {StickyBottomComponent}
          </View>
        )}

        {isNonScrolling(preset) ? <ScreenWithoutScrolling {...otherProps} /> : <ScreenWithScrolling {...otherProps} />}

        {StickyBottomComponent && (
          <View style={styles.stickyBottom} onLayout={stickyBottomLayout}>
            {StickyBottomComponent}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const stylesheet = createStyleSheet(() => {
  return {
    container: {
      flex: 1,
      height: '100%',
      width: '100%',
    },
    spacing: (spacing?: ScreenOuterSpacing) => {
      return {
        paddingTop: spacing?.top ? Spacing[spacing?.top] : 0,
        paddingBottom: spacing?.bottom ? Spacing[spacing?.bottom] : 0,
        paddingLeft: spacing?.left ? Spacing[spacing?.left] : 0,
        paddingRight: spacing?.right ? Spacing[spacing?.right] : 0,
      }
    },
    stickyBottomOffset: (height: number) => {
      return {
        paddingBottom: height + Spacing['xs'],
      }
    },
    stickyTopOffset: (height: number) => {
      return {
        paddingTop: height + Spacing['xs'],
      }
    },
    stickyTop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    stickyBottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10,
    },
    relative: {
      position: 'relative',
    },
    flexEnd: {
      justifyContent: 'flex-end',
    },
    full: {
      flex: 1,
    },
    inner: {
      justifyContent: 'flex-start',
      alignItems: 'stretch',
    },
  }
})
