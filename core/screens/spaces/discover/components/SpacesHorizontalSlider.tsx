import React, { memo } from 'react'
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

type SpacesHorizontalSliderProps = {
  loading?: boolean
  style?: StyleProp<ViewStyle>
  seeMoreButton?: React.ReactElement
  testID?: string
  cardWidth: number
  slideGap: number
}

const SpacesHorizontalSlider = ({
  loading = false,
  style,
  testID = 'holi-slider',
  seeMoreButton,
  children,
  cardWidth,
  slideGap,
}: React.PropsWithChildren<SpacesHorizontalSliderProps>) => {
  return (
    <View style={style} testID={testID}>
      {children && (
        <ScrollView
          // always enable on web to prevent vertical jumping
          scrollEnabled={Platform.OS === 'web' || !loading}
          horizontal
          nestedScrollEnabled
          contentContainerStyle={styles.scrollViewContainer}
        >
          {React.Children.map(children, (space, index) => (
            <View key={index} style={[{ marginRight: slideGap }, { width: cardWidth }]}>
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

const styles = StyleSheet.create({
  scrollViewContainer: {
    paddingVertical: 13,
    marginHorizontal: -20,
    paddingLeft: 20,
    paddingRight: 0,
  },
})
