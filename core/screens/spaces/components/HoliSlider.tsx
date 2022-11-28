import React, { memo } from 'react'
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import { colors } from '@holi/ui/styles/globalVars'
import variables from '@holi/ui/styles/globalVars/variables'

type HoliSliderProps = {
  style?: StyleProp<ViewStyle>
  size?: 'small' | 'medium' | 'large'
  isLoading?: boolean
  testID?: string
  children?: React.ReactNode[]
}

const HoliSlider: React.VFC<HoliSliderProps> = ({
  style,
  size = 'medium',
  isLoading = false,
  testID = 'holi-slider',
  children,
}: HoliSliderProps) => {
  const { width: screenWidth } = useWindowDimensions()
  const styles = getStyles(screenWidth)

  return (
    <View style={style}>
      <ScrollView style={styles.scrollViewContainer} horizontal testID={testID}>
        {children &&
          children.map((child, index) => (
            <View key={index} style={[styles.cardContainer, styles[`cardContainer_${size}`]]}>
              {child}
            </View>
          ))}
        {isLoading && (
          <View style={[styles.loadingContainer, styles[`cardContainer_${size}`]]}>
            <HoliIcon icon="loader-4" size={50} color={colors.fontColorGrey} spinning />
          </View>
        )}
      </ScrollView>
    </View>
  )
}
export default memo(HoliSlider)

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    cardContainer: {
      marginRight: 8,
    },
    cardContainer_small: {
      width: Platform.OS === 'web' && screenWidth > +variables.breakpointS ? 160 : screenWidth / 2.5 - 24,
    },
    cardContainer_medium: {
      width: Platform.OS === 'web' && screenWidth > +variables.breakpointS ? 260 : screenWidth / 2.1 - 24,
    },
    cardContainer_large: {
      width: Platform.OS === 'web' && screenWidth > +variables.breakpointS ? 320 : screenWidth / 1.5 - 12,
    },
    scrollViewContainer: {
      paddingVertical: 18,
      marginHorizontal: -20,
      paddingLeft: 24,
    },
    loadingContainer: {
      height: 160,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgroundColorGrey,
    },
  })
