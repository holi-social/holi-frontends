import React, { useRef, useCallback, useState } from 'react'
import { View, StatusBar, Platform, type LayoutChangeEvent } from 'react-native'
import { useBricks, useStyles } from 'holi-bricks/hooks'
import { KeyboardAvoidingView, KeyboardAwareScrollView } from 'react-native-keyboard-controller'
import { useScrollToTop } from '@react-navigation/native'
import { useAutoPreset } from '@holi/core/components/Screen/useAutoPreset'
import { SafeAreaView } from 'react-native-safe-area-context'
import ScrollHeaderLayout from '@holi/core/components/ScrollHeaderLayout'
import Animated from 'react-native-reanimated'
import { stylesheet } from '@holi/core/components/Screen/styles'
import type {
  AutoScreenProps,
  FixedScreenProps,
  ScreenPreset,
  ScreenProps,
  ScrollScreenProps,
} from '@holi/core/components/Screen/types'

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
    contentPadding,
    noHeader = false,
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
      style={[styles.container, ScrollViewProps?.style, !enableScrollHeader && styles.withoutScrollHeader, style]}
      contentContainerStyle={[
        styles.screenContentContainer(noHeader),
        ScrollViewProps?.contentContainerStyle,
        contentContainerStyle,
        styles.padding(contentPadding),
      ]}
    >
      {children}
    </Container>
  )
}

function ScreenWithoutScrolling({ children, StickyTopComponent, contentPadding, noHeader = false }: FixedScreenProps) {
  const { styles } = useStyles(stylesheet)
  const [stickyTopOffset, setStickyTopOffset] = useState(0)
  const stickyTopLayout = useCallback((e: LayoutChangeEvent) => {
    setStickyTopOffset(e.nativeEvent.layout.height)
  }, [])
  return (
    <View
      style={[
        styles.screenContentContainer(noHeader),
        StickyTopComponent ? styles.stickyTopOffset(stickyTopOffset) : null,
      ]}
    >
      {StickyTopComponent && (
        <View style={styles.stickyTop} onLayout={stickyTopLayout}>
          {StickyTopComponent}
        </View>
      )}
      <View style={styles.padding(contentPadding)}>{children}</View>
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
    padding,
    testID,
    ...otherProps
  } = props
  const { styles, theme } = useStyles(stylesheet)
  const [stickyBottomOffset, setStickyBottomOffset] = useState(0)
  const { getActiveThemeName } = useBricks()
  const themeName = getActiveThemeName()
  const stickyBottomLayout = useCallback((e: LayoutChangeEvent) => {
    setStickyBottomOffset(e.nativeEvent.layout.height)
  }, [])

  return (
    <SafeAreaView
      edges={safeAreaEdges}
      mode="padding"
      testID={testID}
      style={[
        styles.padding(padding),
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
          styles.flex1,
          KeyboardAvoidingViewProps?.style,
          styles.relative,
          StickyBottomComponent ? styles.stickyBottomOffset(stickyBottomOffset) : null,
          //
        ]}
      >
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
