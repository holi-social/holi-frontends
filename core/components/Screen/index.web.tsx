import React, { useCallback, useState } from 'react'
import { View, StatusBar, type LayoutChangeEvent } from 'react-native'
import { useBricks, useStyles } from 'holi-bricks/hooks'
import { useAutoPreset } from '@holi/core/components/Screen/useAutoPreset'
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

function isNonScrolling(preset?: ScreenPreset) {
  return !preset || preset === 'fixed'
}

function ScreenWithScrolling(props: ScreenProps) {
  const {
    children,
    keyboardShouldPersistTaps = 'handled',
    contentContainerStyle,
    ScrollViewProps,
    enableScrollHeader,
    style,
  } = props as ScrollScreenProps
  const { scrollEnabled, onContentSizeChange, onLayout } = useAutoPreset(props as AutoScreenProps)
  const Container = enableScrollHeader ? ScrollHeaderLayout : Animated.ScrollView

  return (
    <Container
      {...{ keyboardShouldPersistTaps, scrollEnabled }}
      {...ScrollViewProps}
      onLayout={(e) => {
        onLayout(e)
        ScrollViewProps?.onLayout?.(e)
      }}
      onContentSizeChange={(w: number, h: number) => {
        onContentSizeChange(w, h)
        ScrollViewProps?.onContentSizeChange?.(w, h)
      }}
      style={[ScrollViewProps?.style, style]}
      contentContainerStyle={[ScrollViewProps?.contentContainerStyle, contentContainerStyle]}
    >
      {children}
    </Container>
  )
}

function ScreenWithoutScrolling({ children, StickyTopComponent, noHeader = false }: FixedScreenProps) {
  const { styles } = useStyles(stylesheet)
  const [stickyTopOffset, setStickyTopOffset] = useState(0)
  const stickyTopLayout = useCallback((e: LayoutChangeEvent) => {
    setStickyTopOffset(e.nativeEvent.layout.height)
  }, [])
  return (
    <View
      style={[
        styles.screenContentContainer(noHeader),
        styles.innerWeb,
        StickyTopComponent ? styles.stickyTopOffset(stickyTopOffset) : null,
      ]}
    >
      {StickyTopComponent && (
        <View style={[styles.stickyTopWeb(stickyTopOffset), { position: 'fixed' }]} onLayout={stickyTopLayout}>
          {StickyTopComponent}
        </View>
      )}
      <View style={styles.container}>{children}</View>
    </View>
  )
}

export const Screen = (props: ScreenProps) => {
  const {
    preset = 'fixed',
    StatusBarProps,
    KeyboardAvoidingViewProps,
    backgroundColor,
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
    <View
      testID={testID}
      style={[
        styles.padding(padding),
        styles.container,
        { backgroundColor: backgroundColor || theme.colors.background },
      ]}
    >
      <StatusBar {...StatusBarProps} barStyle={themeName === 'dark' ? 'light-content' : 'dark-content'} />

      <View
        style={[
          styles.flex1,
          styles.webContainer,
          KeyboardAvoidingViewProps?.style,
          StickyBottomComponent ? styles.stickyBottomOffset(stickyBottomOffset) : null,
        ]}
      >
        {isNonScrolling(preset) ? <ScreenWithoutScrolling {...otherProps} /> : <ScreenWithScrolling {...otherProps} />}

        {StickyBottomComponent && (
          <View
            style={[styles.stickyBottomWeb(stickyBottomOffset), { position: 'fixed' }]}
            onLayout={stickyBottomLayout}
          >
            {StickyBottomComponent}
          </View>
        )}
      </View>
    </View>
  )
}
