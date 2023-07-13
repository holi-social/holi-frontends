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
  const styles = getStyles(cardWidth)

  return (
    <View style={style} testID={testID}>
      {children && (
        <ScrollView
          // on web scrollbar would jump when changing this, so we don't disable there
          scrollEnabled={Platform.OS === 'web' ? true : !loading}
          horizontal
          nestedScrollEnabled
          contentContainerStyle={styles.scrollViewContainer}
        >
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

const getStyles = (cardWidth: number) =>
  StyleSheet.create({
    cardContainer: {
      width: cardWidth,
    },
    scrollViewContainer: {
      paddingVertical: 13,
      marginHorizontal: -20,
      paddingLeft: 20,
      paddingRight: 0,
    },
  })
