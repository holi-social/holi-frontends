import { LinearGradient } from 'expo-linear-gradient'
import React, { createContext, useContext, useRef, useState } from 'react'
import { useEffect } from 'react'
import { useCallback } from 'react'
import {
  Animated,
  Image,
  ImageBackground,
  NativeScrollEvent,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native'

import { Header, HeaderBackButton, getHeaderTitle } from '@react-navigation/elements'
import { useNavigation } from '@react-navigation/native'
import { NativeStackHeaderProps, NativeStackNavigationOptions } from '@react-navigation/native-stack'

import { colors } from '@holi/ui/styles/globalVars'

const ScrollYValueContext = createContext(0)
const ScrollYHandlerContext = createContext<(event: { nativeEvent: NativeScrollEvent }) => void>(() => null)

export const ScrollYProvider: React.FC = ({ children }) => {
  const [scrollY, setScrollY] = useState(0)

  const onScroll = useCallback(
    (event: { nativeEvent: NativeScrollEvent }) => {
      setScrollY(event.nativeEvent?.contentOffset?.y ?? 0)
    },
    [setScrollY]
  )

  return (
    <ScrollYValueContext.Provider value={scrollY}>
      <ScrollYHandlerContext.Provider value={onScroll}>{children}</ScrollYHandlerContext.Provider>
    </ScrollYValueContext.Provider>
  )
}

export const useScrollYValue = () => {
  const scrollY = useContext(ScrollYValueContext)

  if (scrollY == undefined) {
    throw new Error('useScrollYValue() must be used within a ScrollYProvider')
  }

  return scrollY
}

export const useScrollYHandler = () => {
  const onScroll = useContext(ScrollYHandlerContext)

  if (onScroll == undefined) {
    throw new Error('useScrollYSetter() must be used within a ScrollYProvider')
  }

  return onScroll
}

const useHeaderHideAnimation = (headerHeight: number) => {
  const scrollY = useScrollYValue()
  const prevScrollY = useRef(scrollY)
  const isHeaderShown = useRef(true)
  const navigation = useNavigation()
  const { height } = useWindowDimensions()

  const headerSlideAnimation = useRef(new Animated.Value(scrollY)).current
  const hederHeightAnimation = useRef(new Animated.Value(headerHeight)).current

  // on scroll change
  useEffect(() => {
    const shouldShowHeader = scrollY < height / 3 || scrollY < prevScrollY.current

    if (isHeaderShown.current !== shouldShowHeader) {
      Animated.timing(headerSlideAnimation, {
        toValue: shouldShowHeader ? 0 : 1,
        duration: 300,
        useNativeDriver: false,
      }).start()

      isHeaderShown.current = shouldShowHeader
    }

    prevScrollY.current = scrollY
  }, [height, scrollY, headerSlideAnimation, hederHeightAnimation])

  // reset header on screen change (navigation from one screen to another)
  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      headerSlideAnimation.setValue(0)
    })
    return unsubscribe
  }, [navigation, headerSlideAnimation])

  return headerSlideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -headerHeight],
  })
}

export interface NativeStackNavigationCustomHeaderOptions extends NativeStackNavigationOptions {
  headerCustomOptions?: Partial<{
    headerBackgroundImageURI: string
    headerBackgroundGradient: boolean
    headerBackgroundCustom: React.ReactNode
  }>
}

const HeaderAnimated: React.VFC<NativeStackHeaderProps> = ({ back, options, route, navigation }) => {
  const {
    headerTintColor,
    headerLeft,
    headerBackTitle,
    headerBackImageSource,
    headerRight,
    headerTitle,
    headerStyle,
    headerTransparent,
    headerShown,
    headerCustomOptions: { headerBackgroundImageURI, headerBackgroundGradient, headerBackgroundCustom } = {},
    ...restOptions
  } = options as NativeStackNavigationCustomHeaderOptions

  const [headerHeight, setHeaderHeight] = useState(0)

  const headerSlideAnimation = useHeaderHideAnimation(headerHeight)

  const canGoBack = back !== undefined

  if (headerShown === false) return null

  return (
    <Animated.View style={[styles.header, headerStyle, { top: headerSlideAnimation }]}>
      <View
        pointerEvents="box-none"
        style={[StyleSheet.absoluteFill, { backgroundColor: headerTransparent ? 'transparent' : 'white' }]}
      >
        {headerBackgroundCustom ? (
          headerBackgroundCustom
        ) : (
          <>
            {headerBackgroundImageURI && (
              <ImageBackground source={{ uri: headerBackgroundImageURI }} style={StyleSheet.absoluteFill} />
            )}
            {headerBackgroundGradient && (
              <LinearGradient colors={[colors.shadowColorBlack, 'transparent']} style={StyleSheet.absoluteFill} />
            )}
          </>
        )}
      </View>

      <SafeAreaView style={{ marginHorizontal: 12 }}>
        <Animated.View
          style={{
            top: headerSlideAnimation,
          }}
          onLayout={(event) => setHeaderHeight(event.nativeEvent.layout.height)}
        >
          {/* copied usage of Header from node_modules/@react-navigation/native-stack/src/views/NativeStackView.tsx */}
          <Header
            title={getHeaderTitle(options, route.name)}
            headerTintColor={headerTintColor}
            headerLeft={
              typeof headerLeft === 'function'
                ? ({ tintColor }) =>
                    headerLeft({
                      tintColor,
                      canGoBack,
                      label: headerBackTitle,
                    })
                : headerLeft === undefined && canGoBack
                ? ({ tintColor }) => (
                    <HeaderBackButton
                      tintColor={tintColor}
                      backImage={
                        headerBackImageSource !== undefined
                          ? () => <Image source={headerBackImageSource} style={[styles.backImage, { tintColor }]} />
                          : undefined
                      }
                      onPress={navigation.goBack}
                      canGoBack={canGoBack}
                    />
                  )
                : headerLeft
            }
            headerRight={
              typeof headerRight === 'function' ? ({ tintColor }) => headerRight({ tintColor, canGoBack }) : headerRight
            }
            headerTitle={
              typeof headerTitle === 'function'
                ? ({ children, tintColor }) => headerTitle({ children, tintColor })
                : headerTitle
            }
            headerTransparent={headerTransparent}
            {...restOptions}
          />
        </Animated.View>
      </SafeAreaView>
    </Animated.View>
  )
}

export default HeaderAnimated

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backImage: {
    height: 24,
    width: 24,
    margin: 3,
    resizeMode: 'contain',
  },
})
