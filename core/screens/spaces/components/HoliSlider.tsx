import React from 'react'
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import { colors } from '@holi/ui/styles/globalVars'

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
  isLoading = true,
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
            <View key={`holiSlider_item_${index}`} style={[styles.cardContainer, styles[`cardContainer_${size}`]]}>
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
export default HoliSlider

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    cardContainer: {
      marginRight: 12,
    },
    cardContainer_small: {
      width: Platform.OS === 'web' ? 160 : screenWidth / 2.5 - 24,
    },
    cardContainer_medium: {
      width: Platform.OS === 'web' ? 260 : screenWidth / 2.1 - 24,
    },
    cardContainer_large: {
      width: Platform.OS === 'web' ? 320 : screenWidth / 1.5 - 12,
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
