import React, { memo } from 'react'
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

type SpacesHorizontalSliderProps = {
  style?: StyleProp<ViewStyle>
  seeMoreButton?: React.ReactElement
  testID?: string
  slideGap: number
}

const SpacesHorizontalSlider = ({
  style,
  testID = 'holi-slider',
  seeMoreButton,
  children,
  slideGap,
}: React.PropsWithChildren<SpacesHorizontalSliderProps>) => {
  const { width: screenWidth } = useWindowDimensions()
  const styles = getStyles(screenWidth)

  return (
    <View style={style} testID={testID}>
      {children && (
        <ScrollView horizontal nestedScrollEnabled contentContainerStyle={styles.scrollViewContainer}>
          {React.Children.map(children, (space, index) => (
            <View key={index} style={[{ marginRight: slideGap }, styles.cardContainer]}>
              {space}
            </View>
          ))}
          {seeMoreButton && <View style={{ marginRight: slideGap }}>{seeMoreButton}</View>}
        </ScrollView>
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
      paddingRight: 0,
    },
  })
