import React from 'react'
import { Platform, View } from 'react-native'

import { Header, getHeaderTitle } from '@react-navigation/elements'

import HeaderBackButton from '@holi/core/navigation/components/HeaderBackButton'
import { type NavigationCustomOptions } from '@holi/core/navigation/hooks/useScreenOptions/types'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { useTheme } from '@holi/ui/styles/theme'

import AnimatedWrapper from './AnimatedWrapper'
import { HeaderAnimatedProps } from './types'

/**
 *
 * NOTICE: Header is animated only when 'headerTransparent' prop is true
 *
 */
const HeaderAnimated = (props: HeaderAnimatedProps) => {
  const { theme } = useTheme()
  const { colors } = theme

  if (props.web) return null
  const { back, options, route, navigation } = props

  const {
    headerTitleAlign = 'center',
    headerTintColor,
    headerLeft,
    headerBackTitle,
    headerRight,
    headerTitle,
    headerStyle,
    headerTransparent,
    headerShown,
    navigationCustomOptions = {},
    ...restOptions
  } = options as NavigationCustomOptions

  const bgOptions = navigationCustomOptions.background

  const canGoBack = back !== undefined

  if (headerShown === false) return null

  return (
    <AnimatedWrapper
      animatable={headerTransparent}
      backgroundColor={
        (!!headerStyle && 'backgroundColor' in headerStyle && headerStyle.backgroundColor) || colors.background10
      }
      backgroundOptions={bgOptions}
    >
      <SafeArea edges={Platform.OS === 'ios' ? ['top'] : []}>
        {/**
         * Native iOS Header has 10px vertical marging. Add 6px according to our design (16px)
         * Android seems to have 16px vertical padding by default
         * */}
        <View style={{ paddingHorizontal: 16, paddingVertical: Platform.OS === 'ios' ? 6 : 0 }}>
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
                  ? ({ tintColor }) => <HeaderBackButton tintColor={tintColor} onPress={navigation.goBack} />
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
            headerTitleStyle={{ color: colors.black300 }}
            headerShadowVisible={false}
            headerStyle={{ backgroundColor: 'transparent' }}
            {...restOptions}
          />
        </View>
      </SafeArea>
    </AnimatedWrapper>
  )
}

export default HeaderAnimated
