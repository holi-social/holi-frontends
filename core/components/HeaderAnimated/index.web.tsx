import React, { useEffect } from 'react'
import { StyleSheet, View } from 'react-native'

import { useHeaderAnimationProgress } from '@holi/core/helpers/useHeaderAnimationProgress'
import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { Text } from 'holi-bricks/components/text'
import { useScreenOptions } from '@holi/core/navigation/hooks/useScreenOptions'
import HoliContainer from '@holi/ui/components/atoms/HoliContainer'
import { dimensions } from '@holi/ui/styles/globalVars'
import { useTheme } from '@holi/ui/styles/theme'

import AnimatedWrapper from './AnimatedWrapper'

const HeaderAnimated = () => {
  const { theme } = useTheme()
  const { colors } = theme
  const options = useScreenOptions()

  const {
    title,
    headerStyle,
    headerTitle,
    headerLeft,
    headerRight,
    headerShown,
    headerTransparent,
    headerTintColor,
    navigationCustomOptions = {},
  } = options

  const headerAnimatedProgress = useHeaderAnimationProgress()

  useEffect(() => {
    headerAnimatedProgress.value = 1
  }, [headerAnimatedProgress])

  const bgOptions = navigationCustomOptions.background

  if (headerShown === false) return null

  return (
    <>
      {!headerTransparent && <div style={{ height: dimensions.topBarHeight }} />}
      <div style={{ position: 'fixed', width: '100%', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <AnimatedWrapper
          animatable={headerTransparent}
          backgroundColor={
            (!!headerStyle && 'backgroundColor' in headerStyle && headerStyle.backgroundColor) || colors.background10
          }
          backgroundOptions={bgOptions}
        >
          <HoliContainer flex={1} flexDirection="row" justifyContent="center" alignItems="center">
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
                ) : (
                  <Text headingLevel="1" size="lg">
                    {typeof headerTitle === 'string' ? headerTitle : title}
                  </Text>
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
        </AnimatedWrapper>
      </div>
    </>
  )
}

export default HeaderAnimated

const styles = StyleSheet.create({
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
