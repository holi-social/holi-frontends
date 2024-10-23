import React, { memo } from 'react'
import { Platform, ScrollView, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'

import Spacing from '@holi/ui/foundations/Spacing'

type SpacesHorizontalSliderProps = {
  loading?: boolean
  style?: StyleProp<ViewStyle>
  seeMoreButton?: React.ReactElement
  testID?: string
  cardWidth: number
  slideGap: number
  paddingVertical?: ViewStyle['paddingVertical']
}

const SpacesHorizontalSlider = ({
  loading = false,
  style,
  testID = 'holi-slider',
  seeMoreButton,
  children,
  cardWidth,
  slideGap,
  paddingVertical = Spacing.xxs,
}: React.PropsWithChildren<SpacesHorizontalSliderProps>) => {
  return (
    <View style={style} testID={testID}>
      {children && (
        <ScrollView
          // always enable on web to prevent vertical jumping
          scrollEnabled={Platform.OS === 'web' || !loading}
          horizontal
          nestedScrollEnabled
          contentContainerStyle={[styles.scrollViewContainer, !!paddingVertical && { paddingVertical }]}
        >
          {React.Children.map(children, (space, index) => (
            <View key={index} style={{ marginRight: slideGap, width: cardWidth }}>
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
    marginHorizontal: -20,
    paddingLeft: 20,
    paddingRight: 0,
  },
})
