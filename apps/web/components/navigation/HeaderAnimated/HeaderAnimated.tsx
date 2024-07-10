import { throttle } from 'lodash'
import React from 'react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ImageBackground, StyleSheet, View } from 'react-native'
import { Animated } from 'react-native'

import { setScreenScrollY, useScreenScrollY } from '@holi/core/helpers'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { useScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import HoliLogo from '@holi/ui/components/atoms/HoliLogo'
import HoliButton from '@holi/ui/components/molecules/HoliButton'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'

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
  const { theme } = useTheme()
  const { colors } = theme
  const options = useScreenOptions()
  const { t } = useTranslation()
  const headerHideAnimation = useHeaderHideAnimation()
  const { navigate } = useRouting()

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
      <HoliContainer flex={1} flexDirection="row" justifyContent="center" alignItems="center">
        <View style={{ width: '100%' }}>
          <View style={[styles.sideHeaderElement, styles.leftHeaderElement]}>
            {typeof headerLeft === 'function' ? (
              headerLeft({ tintColor: headerTintColor, canGoBack: true })
            ) : headerLeft !== undefined ? (
              headerLeft
            ) : (
              <HoliButton transparent inline label={t('navigation.title')} onPress={() => navigate('/')}>
                <HoliLogo />
              </HoliButton>
            )}
          </View>

          <View style={styles.centerHeaderElement}>
            {typeof headerTitle === 'function' ? (
              headerTitle({ children: title || '', tintColor: headerTintColor })
            ) : (
              <HeaderTitle tintColor={headerTintColor}>
                {typeof headerTitle === 'string' ? headerTitle : title}
              </HeaderTitle>
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
      </HoliContainer>
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
