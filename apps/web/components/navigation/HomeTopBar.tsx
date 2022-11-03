import React, { useState } from 'react'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View, useWindowDimensions } from 'react-native'
import { Animated } from 'react-native'

import HeaderLeft from '@holi/core/navigation/components/HeaderLeft'
import HeaderRight from '@holi/core/navigation/components/HeaderRight'
import HeaderTitle from '@holi/core/navigation/components/HeaderTitle'
import { colors, vars } from '@holi/ui/styles/globalVars'

export const useHeaderHideAnimation = () => {
  const [scrollY, setScrollY] = useState(0)
  const prevScrollY = useRef(scrollY)
  const isHeaderShown = useRef(true)

  const headerSlideAnimation = useRef(new Animated.Value(0)).current

  // update scrollY on window scroll
  useEffect(() => {
    const onWindowScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', onWindowScroll)
    return () => window.removeEventListener('scroll', onWindowScroll)
  }, [])

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

const HomeTopBar: React.VoidFunctionComponent = () => {
  const { width } = useWindowDimensions()
  const { t } = useTranslation()
  const styles = getStyles(width)

  const headerHideAnimation = useHeaderHideAnimation()

  return (
    <Animated.View
      style={[styles.fullWidthContainer, { top: headerHideAnimation }]}
      accessible={true}
      accessibilityRole="navigation"
      accessibilityLabel={t('navigation.topNavigation')}
    >
      <View style={styles.buttonContainer}>
        <HeaderLeft style={styles.leftItem} />

        <HeaderTitle style={{ paddingTop: 5 }} />

        <HeaderRight style={styles.rightItem} />
      </View>
    </Animated.View>
  )
}

export default HomeTopBar

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    fullWidthContainer: {
      alignItems: 'center',
      backgroundColor: colors.backgroundColorWhite,
      paddingHorizontal: screenWidth > +vars.breakpointL ? 20 : 10,
      height: vars.topBarHeight,
      maxHeight: vars.topBarHeight,
    },
    buttonContainer: {
      flex: 1,
      alignItems: 'center',
      width: '100%',
      maxWidth: vars.maxScreenWidth,
      justifyContent: 'center',
      position: 'relative',
    },
    leftItem: {
      position: 'absolute',
      left: 0,
      top: 5,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
    rightItem: {
      position: 'absolute',
      right: 0,
      top: 5,
      paddingHorizontal: 20,
      paddingVertical: 10,
    },
  })
