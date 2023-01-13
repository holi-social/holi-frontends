import React, { memo } from 'react'
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

import HoliIcon from '@holi/ui/components/atoms/HoliIcon'
import { colors } from '@holi/ui/styles/globalVars'

type SpacesHorizontalSliderProps = {
  style?: StyleProp<ViewStyle>
  seeMoreButton?: React.ReactElement
  isLoading?: boolean
  testID?: string
  children?: React.ReactNode[]
  slideGap: number
}

const SpacesHorizontalSlider: React.VFC<SpacesHorizontalSliderProps> = ({
  style,
  isLoading = false,
  testID = 'holi-slider',
  seeMoreButton,
  children,
  slideGap,
}: SpacesHorizontalSliderProps) => {
  const { width: screenWidth } = useWindowDimensions()
  const styles = getStyles(screenWidth)

  return (
    <View style={style} testID={testID}>
      {children && !isLoading && (
        <ScrollView horizontal style={styles.scrollViewContainer}>
          {children?.map((space, index) => (
            <View key={index} style={[{ marginRight: slideGap }, styles.cardContainer]}>
              {space}
            </View>
          ))}
          {seeMoreButton}
        </ScrollView>
      )}
      {isLoading && (
        <View style={[styles.loadingContainer, styles.cardContainer]}>
          <HoliIcon icon="loader-4" size={50} color={colors.fontColorGrey} spinning />
        </View>
      )}
    </View>
  )
}
export default memo(SpacesHorizontalSlider)

const getStyles = (screenWidth: number) =>
  StyleSheet.create({
    cardContainer: {
      width: Platform.OS === 'web' ? 320 : screenWidth / 1.5 - 12,
    },
    scrollViewContainer: {
      paddingVertical: 13,
      marginHorizontal: -20,
      paddingLeft: 20,
    },
    loadingContainer: {
      height: 160,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.backgroundColorGrey,
    },
  })
