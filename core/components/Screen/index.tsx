import { styles } from '@holi/core/components/Screen/styles'
import type {
  AutoScreenProps,
  FixedScreenProps,
  ScreenPreset,
  ScreenProps,
  ScrollScreenProps,
} from '@holi/core/components/Screen/types'
import { useAutoPreset } from '@holi/core/components/Screen/useAutoPreset'
import { useScreenComponentInternal } from '@holi/core/components/Screen/useScreenComponentInternal'
import { KeyboardAwareScrollViewRefreshable } from '@holi/core/helpers/withRefreshControl'
import { useScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { useOnRefresh } from '@holi/core/refreshing/hooks/useOnRefresh'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useScrollToTop } from '@react-navigation/native'
import { useBricks } from 'holi-bricks/foundations/colors/themes/useBricks'
import React, { useRef } from 'react'
import { type LayoutChangeEvent, Platform, type ScrollView, View } from 'react-native'
import { KeyboardAvoidingView, useReanimatedKeyboardAnimation } from 'react-native-keyboard-controller'
import Animated, { useAnimatedStyle, useDerivedValue } from 'react-native-reanimated'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { SystemBars } from 'react-native-edge-to-edge'

const isIos = Platform.OS === 'ios'

const useGradualAnimation = () => {
  const { height } = useReanimatedKeyboardAnimation()

  const bottomDistance = useDerivedValue(() => {
    const calculatedDistance = Math.abs(height.value)
    return calculatedDistance >= 0 ? calculatedDistance : 0
  })

  return { bottomDistance }
}

function isNonScrolling(preset?: ScreenPreset) {
  return !preset || preset === 'fixed'
}
export const DEFAULT_KEYBOARD_INPUT_BOTTOM_OFFSET = 80

function ScreenWithScrolling(props: ScreenProps) {
  const {
    children,
    keyboardShouldPersistTaps = 'handled',
    keyboardInputOffset = DEFAULT_KEYBOARD_INPUT_BOTTOM_OFFSET,
    contentContainerStyle,
    scrollViewProps,
    style,
    contentPadding,
    onRefresh,
  } = props as ScrollScreenProps
  const ref = useRef<ScrollView>(null)
  const { scrollEnabled, onContentSizeChange, onLayout } = useAutoPreset(props as AutoScreenProps)

  useOnRefresh(onRefresh)

  // Add native behavior of pressing the active tab to scroll to the top of the content
  // More info at: https://reactnavigation.org/docs/use-scroll-to-top/
  useScrollToTop(ref)

  return (
    <KeyboardAwareScrollViewRefreshable
      bottomOffset={keyboardInputOffset}
      showsVerticalScrollIndicator={false}
      {...{ keyboardShouldPersistTaps, scrollEnabled, ref }}
      {...scrollViewProps}
      onLayout={(e) => {
        if (props.preset === 'auto') {
          onLayout(e)
        }
        scrollViewProps?.onLayout?.(e)
      }}
      onContentSizeChange={(w: number, h: number) => {
        if (props.preset === 'auto') {
          onContentSizeChange(w, h)
        }
        scrollViewProps?.onContentSizeChange?.(w, h)
      }}
      style={[styles.container, scrollViewProps?.style, style]}
      contentContainerStyle={[
        styles.screenContentContainer,
        scrollViewProps?.contentContainerStyle,
        styles.padding(contentPadding),
        contentContainerStyle,
      ]}
    >
      {children}
    </KeyboardAwareScrollViewRefreshable>
  )
}

function ScreenWithoutScrolling({ children, contentPadding, preset, style, contentContainerStyle }: FixedScreenProps) {
  return (
    <View style={[style, styles.container]}>
      <View
        style={[
          contentContainerStyle,
          preset === 'fixed' && styles.flexEnd,
          styles.padding(contentPadding),
          styles.screenContentContainer,
        ]}
      >
        {children}
      </View>
    </View>
  )
}

type BottomComponentWrapperProps = {
  StickyBottomComponent: ScreenProps['StickyBottomComponent']
  padding?: ScreenProps['padding']
  onLayout?: ((event: LayoutChangeEvent) => void) | undefined
  footerHidden?: boolean
}
const BottomComponentWrapper = ({
  StickyBottomComponent,
  padding,
  onLayout,
  footerHidden,
}: BottomComponentWrapperProps) => {
  const { bottomDistance } = useGradualAnimation()
  const bottomBar = footerHidden ? 0 : dimensions.bottomBarHeight
  const bottomInputStyle = useAnimatedStyle(
    () => ({
      bottom: bottomDistance.value - bottomBar < 0 ? 0 : bottomDistance.value - bottomBar,
    }),
    []
  )

  return (
    <Animated.View
      style={[styles.stickyBottom, bottomInputStyle, styles.padding(padding)]}
      onLayout={onLayout as Animated.View['props']['onLayout']}
    >
      {StickyBottomComponent}
    </Animated.View>
  )
}

const DEFAULT_VERTICAL_OFFSET = 100
export const Screen = (props: ScreenProps) => {
  const {
    preset = 'auto',
    keyboardVerticalOffset = 100,
    keyboardAvoidingViewProps,
    backgroundColor = 'main',
    safeAreaEdges = [],
    StickyBottomComponent,
    headerOptions,
    StickyTopComponent,
    padding,
    contentContainerPadding,
    testID,
    ...otherProps
  } = props
  const { theme, getActiveThemeName } = useBricks()
  const themeName = getActiveThemeName()
  const { stickyBottomLayout, stickyBottomOffset, stickyTopLayout, stickyTopOffset } = useScreenComponentInternal({
    headerOptions,
  })
  const safeAreaInsets = useSafeAreaInsets()
  const navigationOptions = useScreenOptions()
  const footerHidden = headerOptions?.navigationCustomOptions?.footerShown === false
  const _keyboardVerticalOffset = keyboardVerticalOffset
    ? keyboardVerticalOffset
    : DEFAULT_VERTICAL_OFFSET + (Platform.OS === 'ios' ? stickyBottomOffset || 0 : 0)

  return (
    <SafeAreaView
      edges={safeAreaEdges}
      mode="padding"
      testID={testID}
      style={[
        styles.container,
        styles.relative,
        styles.padding(padding),
        { backgroundColor: theme.colors.bg[backgroundColor] },
      ]}
    >
      <SystemBars style={themeName} hidden={{ statusBar: false, navigationBar: false }} />

      <KeyboardAvoidingView
        {...keyboardAvoidingViewProps}
        behavior={isIos ? 'padding' : 'height'}
        keyboardVerticalOffset={_keyboardVerticalOffset}
        style={[
          keyboardAvoidingViewProps?.style,
          styles.flex1,
          styles.relative,
          styles.contentContainerPadding(navigationOptions.headerShown, safeAreaInsets.top, contentContainerPadding),
          StickyBottomComponent && preset === 'fixed' ? styles.stickyBottomOffset(stickyBottomOffset) : null,
          StickyTopComponent ? styles.stickyTopOffset(stickyTopOffset) : null,
        ]}
      >
        {StickyTopComponent && (
          <View style={[styles.stickyTop]} onLayout={stickyTopLayout}>
            {StickyTopComponent}
          </View>
        )}

        {isNonScrolling(preset) ? (
          <ScreenWithoutScrolling {...otherProps} />
        ) : (
          <ScreenWithScrolling
            {...otherProps}
            contentContainerStyle={[
              otherProps.contentContainerStyle,
              StickyBottomComponent ? styles.stickyBottomOffset(stickyBottomOffset) : null,
            ]}
          />
        )}
      </KeyboardAvoidingView>

      {StickyBottomComponent && (
        <BottomComponentWrapper
          StickyBottomComponent={StickyBottomComponent}
          footerHidden={footerHidden}
          padding={padding}
          onLayout={stickyBottomLayout}
        />
      )}
    </SafeAreaView>
  )
}
