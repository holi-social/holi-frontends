import React, { type PropsWithChildren } from 'react'
import { ImageBackground, Platform, StatusBar, StyleSheet, View } from 'react-native'
import Animated, { interpolate, useAnimatedStyle } from 'react-native-reanimated'
import tinycolor from 'tinycolor2'

import { useHeaderAnimationProgress } from '@holi/core/helpers'
import { useSafeAreaInsets } from '@holi/core/helpers/useSafeAreaInsets'
import type { HeaderBackgroundOptions } from '@holi/core/navigation/hooks/useScreenOptions/types'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'

import GradientBackground from './GradientBackground'

const isIOS = Platform.OS === 'ios'

interface UseHeaderAnimationStylesArgs {
  headerHeight?: number
  animatable?: boolean
}

const useHeaderAnimationStyles = ({
  headerHeight = dimensions.topBarHeight,
  animatable = false,
}: UseHeaderAnimationStylesArgs) => {
  const headerAnimatedProgress = useHeaderAnimationProgress()

  const animatedStyle = useAnimatedStyle(
    () => ({
      transform: [{ translateY: interpolate(headerAnimatedProgress.value, [0, 1], [-headerHeight, 0]) }],
      opacity: headerAnimatedProgress.value,
    }),
    [headerAnimatedProgress]
  )

  return animatable ? animatedStyle : styles.nonAnimatedHeader
}

interface Props {
  animatable?: boolean
  backgroundOptions?: HeaderBackgroundOptions
  backgroundColor?: string
}

const AnimatedWrapper = ({ animatable, backgroundColor, backgroundOptions, children }: PropsWithChildren<Props>) => {
  const { theme } = useTheme()
  const { colors } = theme
  const { top: safeAreaTop } = useSafeAreaInsets()

  const animatedStyle = useHeaderAnimationStyles({ animatable })

  backgroundColor = backgroundOptions?.type === 'gradient' ? colors.dark : backgroundColor || colors.background10
  const gradientTransparentColor = tinycolor(backgroundColor).setAlpha(0).toRgbString()

  return (
    <View>
      {/*
				Gradient area for SafeArea to protect visibility of statusbar
				Only for iOS. SafeArea is covered for Android and not relevant for Web
			*/}
      {isIOS && safeAreaTop > 0 && (
        <View style={{ height: safeAreaTop, position: 'absolute', top: 0, width: '100%' }}>
          <GradientBackground colors={[backgroundColor, gradientTransparentColor]} />
        </View>
      )}

      <Animated.View style={[styles.header, animatedStyle]}>
        {/* Default Background */}
        {backgroundOptions == undefined && (
          <View
            style={[
              StyleSheet.absoluteFill,
              {
                pointerEvents: 'box-none',
                backgroundColor,
              },
            ]}
          />
        )}
        {/* Gradient Background */}
        {backgroundOptions?.type === 'gradient' && (
          <GradientBackground colors={backgroundOptions.colors ?? [backgroundColor, gradientTransparentColor]} />
        )}
        {/* Image Background */}
        {backgroundOptions?.type === 'image' && (
          <ImageBackground source={{ uri: backgroundOptions.uri }} style={StyleSheet.absoluteFill} />
        )}
        {/* Custom Component Background */}
        {backgroundOptions?.type === 'custom' && backgroundOptions.component}

        {children}
      </Animated.View>
    </View>
  )
}

export default AnimatedWrapper

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    ...Platform.select({
      web: {
        height: dimensions.topBarHeight,
      },
    }),
  },
  nonAnimatedHeader: {
    opacity: 1,
    transform: [{ translateY: 0 }],
  },
})
