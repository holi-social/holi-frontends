import React, { memo } from 'react'
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions } from 'react-native'

type SpacesHorizontalSliderProps = {
  style?: StyleProp<ViewStyle>
  seeMoreButton?: React.ReactElement
  testID?: string
  children?: React.ReactNode[]
  slideGap: number
}

const SpacesHorizontalSlider: React.VFC<SpacesHorizontalSliderProps> = ({
  style,
  testID = 'holi-slider',
  seeMoreButton,
  children,
  slideGap,
}: SpacesHorizontalSliderProps) => {
  const { width: screenWidth } = useWindowDimensions()
  const styles = getStyles(screenWidth)

  return (
    <View style={style} testID={testID}>
      {children && (
        <ScrollView horizontal contentContainerStyle={styles.scrollViewContainer} nestedScrollEnabled={true}>
          {children?.map((space, index) => (
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
