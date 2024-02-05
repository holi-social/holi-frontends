import { throttle } from 'lodash'
import React from 'react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageBackground, StyleSheet, View } from 'react-native'
import { Animated } from 'react-native'

import { setScreenScrollY, useScreenScrollY } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { useScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import { colors, dimensions } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

import HeaderAnimatedGradientBackground from './HeaderAnimatedGradientBackground'

export const useHeaderHideAnimation = () => {
  const scrollY = useScreenScrollY()
  const prevScrollY = useRef(scrollY)
  const isHeaderShown = useRef(true)

  const headerSlideAnimation = useRef(new Animated.Value(0)).current

  // update scrollY on HTML element scroll
  useEffect(() => {
    const onScroll = throttle(() => {
      setScreenScrollY(document.documentElement.scrollTop)
    }, 300)
    document.addEventListener('scroll', onScroll)
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

  // adjust animation on scrollY change
  useEffect(() => {
    const shouldShowHeader = scrollY < document.documentElement.clientHeight / 3 || scrollY < prevScrollY.current

    if (isHeaderShown.current !== shouldShowHeader) {
      Animated.timing(headerSlideAnimation, {
        toValue: shouldShowHeader ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }).start()

      isHeaderShown.current = shouldShowHeader
    }

    prevScrollY.current = scrollY
  }, [scrollY, headerSlideAnimation])

  return headerSlideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '-100%'],
  })
}

const HeaderAnimated = () => {
  const options = useScreenOptions()
  const { t } = useTranslation()
  const mixins = useStyleMixins()
  const headerHideAnimation = useHeaderHideAnimation()

  const {
    title,
    headerStyle,
    headerTitle,
    headerLeft,
    headerRight,
    headerShown,
    headerTransparent,
    headerTintColor,
    navigationCustomOptions: { headerBackgroundImageURI, headerBackgroundGradient, headerBackgroundCustom } = {},
  } = options

  if (headerShown === false) return null

  return (
    <Animated.View
      style={[styles.headerOuter, { top: headerHideAnimation }]}
      accessible
      role="navigation"
      aria-label={t('navigation.topNavigation')}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: headerTransparent ? 'transparent' : colors.background10 },
          headerStyle,
        ]}
      >
        {headerBackgroundCustom ? (
          headerBackgroundCustom
        ) : (
          <>
            {!!headerBackgroundImageURI && (
              <ImageBackground source={{ uri: headerBackgroundImageURI }} style={StyleSheet.absoluteFill} />
            )}
            {headerBackgroundGradient && <HeaderAnimatedGradientBackground />}
          </>
        )}
      </View>

      <View style={[mixins.container, styles.headerContent]}>
        <View style={{ width: '100%' }}>
          <View style={[styles.sideHeaderElement, styles.leftHeaderElement]}>
            {typeof headerLeft === 'function' ? (
              headerLeft({ tintColor: headerTintColor, canGoBack: true })
            ) : headerLeft !== undefined ? (
              headerLeft
            ) : (
              <HeaderBackButton tintColor={headerTintColor} />
            )}
          </View>

          <View style={styles.centerHeaderElement}>
            {typeof headerTitle === 'function' ? (
              headerTitle({ children: title || '', tintColor: headerTintColor })
            ) : headerTitle !== undefined ? (
              headerLeft
            ) : (
              <HeaderTitle tintColor={headerTintColor}>{title}</HeaderTitle>
            )}
          </View>

          {headerRight && (
            <View style={[styles.sideHeaderElement, styles.rightHeaderElement]}>
              {typeof headerRight === 'function'
                ? headerRight({ tintColor: headerTintColor, canGoBack: true })
                : headerRight}
            </View>
          )}
        </View>
      </View>
    </Animated.View>
  )
}

export default HeaderAnimated

const styles = StyleSheet.create({
  headerOuter: {
    alignItems: 'center',
    width: '100%',
    height: dimensions.topBarHeight,
    maxHeight: dimensions.topBarHeight,
  },
  headerContent: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sideHeaderElement: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: '-50%' as unknown as number }], // 'string' value for translateY forks for WEB
  },
  leftHeaderElement: {
    left: 0,
  },
  rightHeaderElement: {
    right: 0,
  },
  centerHeaderElement: {
    maxWidth: '70%',
    alignSelf: 'center',
  },
})
