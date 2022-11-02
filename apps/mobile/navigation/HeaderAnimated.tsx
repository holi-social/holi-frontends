import { LinearGradient } from 'expo-linear-gradient'
import React, { useRef, useState } from 'react'
import { useEffect } from 'react'
import {
  Animated,
  Image,
  ImageBackground,
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

import { useScrollYValue } from '@holi/core/helpers'
import { colors } from '@holi/ui/styles/globalVars'

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
    headerTitleAlign = 'center',
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
            headerTitleAlign={headerTitleAlign}
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
