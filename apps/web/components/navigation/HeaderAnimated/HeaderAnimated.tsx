import React, { useState } from 'react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageBackground, StyleSheet, View } from 'react-native'
import { Animated } from 'react-native'

import { useScrollYValue } from '@holi/core/helpers'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { useUnifiedNavigation } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import { colors, vars } from '@holi/ui/styles/globalVars'

import HeaderAnimatedGradienBackground from './HeaderAnimatedGradienBackground'

export const useHeaderHideAnimation = () => {
  const scrollYValue = useScrollYValue()
  const [scrollY, setScrollY] = useState(scrollYValue)
  const prevScrollY = useRef(scrollY)
  const isHeaderShown = useRef(true)

  const headerSlideAnimation = useRef(new Animated.Value(0)).current

  // update scrollY on window scroll
  useEffect(() => {
    const onWindowScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onWindowScroll)
    return () => window.removeEventListener('scroll', onWindowScroll)
  }, [])

  useEffect(() => {
    setScrollY(scrollYValue)
  }, [scrollYValue, setScrollY])

  // adjust animation on scrollY change
  useEffect(() => {
    const shouldShowHeader = scrollY < window.outerHeight / 3 || scrollY < prevScrollY.current

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

const HeaderAnimated: React.VoidFunctionComponent = () => {
  const { options } = useUnifiedNavigation()
  const { t } = useTranslation()
  const headerHideAnimation = useHeaderHideAnimation()

  const {
    title,
    headerStyle,
    headerTitle,
    headerLeft,
    headerRight,
    headerTransparent,
    headerTintColor,
    navigationCustomOptions: { headerBackgroundImageURI, headerBackgroundGradient, headerBackgroundCustom } = {},
  } = options

  return (
    <Animated.View
      style={[styles.headerOuter, { top: headerHideAnimation }]}
      accessible
      accessibilityRole="navigation"
      accessibilityLabel={t('navigation.topNavigation')}
    >
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: headerTransparent ? 'transparent' : colors.backgroundColorWhite },
          headerStyle,
        ]}
      >
        {headerBackgroundCustom ? (
          headerBackgroundCustom
        ) : (
          <>
            {headerBackgroundImageURI && (
              <ImageBackground source={{ uri: headerBackgroundImageURI }} style={StyleSheet.absoluteFill} />
            )}
            {headerBackgroundGradient && <HeaderAnimatedGradienBackground />}
          </>
        )}
      </View>

      <View style={styles.headerContent}>
        <View style={[styles.sideHeaderElement, styles.leftHeaderElement]}>
          {typeof headerLeft === 'function' ? (
            headerLeft({ tintColor: headerTintColor, canGoBack: true })
          ) : headerLeft !== undefined ? (
            headerLeft
          ) : (
            <HeaderBackButton tintColor={headerTintColor} />
          )}
        </View>

        <View style={{ maxWidth: '70%' }}>
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
    </Animated.View>
  )
}

export default HeaderAnimated

const styles = StyleSheet.create({
  headerOuter: {
    alignItems: 'center',
    height: vars.topBarHeight,
    maxHeight: vars.topBarHeight,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    maxWidth: vars.maxScreenWidth,
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
})
